import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminDb, getAdminStorage } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Helper to determine uploads directory reliably
function getUploadsDirectory(): string {
  const p1 = path.join(process.cwd(), "public", "uploads");
  const p2 = path.join(process.cwd(), "frontend", "public", "uploads");

  if (fs.existsSync(path.join(process.cwd(), "public"))) {
    return p1;
  }
  return p2;
}

// Safely ensure directory exists without throwing on read-only systems (e.g. Vercel)
function safeEnsureUploadsDirectory(): string | null {
  try {
    const dir = getUploadsDirectory();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  } catch (e) {
    // Read-only filesystem in serverless environments (e.g. Vercel)
    return null;
  }
}

// 1. UPLOAD IMAGE
export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("adab_admin_authenticated")?.value;
    if (authCookie !== "true") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided in request." },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type "${file.type}". Please upload JPG, PNG, WEBP, or SVG images.`,
        },
        { status: 400 }
      );
    }

    // Sanitize filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = path.extname(originalName) || ".jpg";
    const baseName = path.basename(originalName, ext);
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`.toLowerCase();

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Destination 1: Try Firebase Cloud Storage if bucket exists
    let uploadedToStorage = false;
    try {
      const storage = getAdminStorage();
      if (storage) {
        const bucket = storage.bucket();
        const [exists] = await bucket.exists();
        if (exists) {
          const fileRef = bucket.file(`uploads/${uniqueFileName}`);
          await fileRef.save(buffer, {
            contentType: file.type || "image/jpeg",
            metadata: {
              cacheControl: "public, max-age=31536000",
            },
          });
          uploadedToStorage = true;
        }
      }
    } catch (storageErr) {
      console.warn("[Upload] Firebase Storage upload skipped/failed:", storageErr);
    }

    // Destination 2: Firestore Media Storage (Works 100% reliably in serverless environments)
    const db = getAdminDb();
    if (db) {
      try {
        const docRef = db.collection("media").doc(uniqueFileName);
        const base64Data = buffer.toString("base64");

        // If file buffer <= 700KB, store in single document
        if (buffer.length <= 700 * 1024) {
          await docRef.set({
            fileName: uniqueFileName,
            contentType: file.type || "image/jpeg",
            size: file.size,
            isChunked: false,
            data: base64Data,
            createdAt: new Date().toISOString(),
          });
        } else {
          // If larger than 700KB, split into 500KB chunks in subcollection
          const CHUNK_SIZE = 500 * 1024;
          const chunks: string[] = [];
          for (let i = 0; i < base64Data.length; i += CHUNK_SIZE) {
            chunks.push(base64Data.slice(i, i + CHUNK_SIZE));
          }

          await docRef.set({
            fileName: uniqueFileName,
            contentType: file.type || "image/jpeg",
            size: file.size,
            isChunked: true,
            chunkCount: chunks.length,
            createdAt: new Date().toISOString(),
          });

          const batch = db.batch();
          for (let i = 0; i < chunks.length; i++) {
            const chunkRef = docRef.collection("chunks").doc(String(i));
            batch.set(chunkRef, { index: i, data: chunks[i] });
          }
          await batch.commit();
        }
      } catch (dbErr) {
        console.warn("[Upload] Firestore media save error:", dbErr);
      }
    }

    // Destination 3: Local Filesystem (Local development cache; gracefully ignores EROFS on Vercel)
    try {
      const uploadsDir = safeEnsureUploadsDirectory();
      if (uploadsDir) {
        const fullFilePath = path.join(uploadsDir, uniqueFileName);
        await fs.promises.writeFile(fullFilePath, buffer);
      }
    } catch (diskErr) {
      // Normal on read-only serverless runtimes like Vercel
    }

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
      message: "Image uploaded successfully!",
    });
  } catch (error: any) {
    console.error("POST /api/admin/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image." },
      { status: 500 }
    );
  }
}

// 2. DELETE IMAGE
export async function DELETE(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("adab_admin_authenticated")?.value;
    if (authCookie !== "true") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const targetUrl = searchParams.get("url") || body.url;

    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required 'url' parameter" },
        { status: 400 }
      );
    }

    // Security check: only allow deleting files under /uploads/
    if (!targetUrl.startsWith("/uploads/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Only newly uploaded images in /uploads/ can be deleted from disk. Default template images are protected.",
        },
        { status: 403 }
      );
    }

    const fileName = path.basename(targetUrl);
    // Extra path traversal guard
    if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
      return NextResponse.json({ success: false, error: "Invalid filename" }, { status: 400 });
    }

    // 1. Delete from Firestore Media (including subcollection chunks)
    const db = getAdminDb();
    if (db) {
      try {
        const docRef = db.collection("media").doc(fileName);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const docData = docSnap.data();
          if (docData?.isChunked) {
            const chunksSnap = await docRef.collection("chunks").get();
            const batch = db.batch();
            chunksSnap.forEach((c) => batch.delete(c.ref));
            await batch.commit();
          }
          await docRef.delete();
        }
      } catch (dbErr) {
        console.warn("[Delete] Firestore media deletion warning:", dbErr);
      }
    }

    // 2. Delete from Firebase Storage if present
    try {
      const storage = getAdminStorage();
      if (storage) {
        const bucket = storage.bucket();
        const [exists] = await bucket.exists();
        if (exists) {
          await bucket.file(`uploads/${fileName}`).delete({ ignoreNotFound: true });
        }
      }
    } catch (storageErr) {
      // Ignore
    }

    // 3. Delete from Local disk (if present and writable)
    try {
      const uploadsDir = getUploadsDirectory();
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (diskErr) {
      // Ignore EROFS
    }

    return NextResponse.json({
      success: true,
      message: `Image ${fileName} deleted successfully.`,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete image." },
      { status: 500 }
    );
  }
}

// 3. GET ALL AVAILABLE IMAGES (Media Library)
export async function GET() {
  try {
    const images: { url: string; name: string; folder: string }[] = [];
    const existingUrls = new Set<string>();

    // Helper to scan directory safely
    const scanDir = (dirPath: string, folderName: string, urlPrefix: string) => {
      try {
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          for (const file of files) {
            if (file.startsWith(".")) continue;
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);
            if (stat.isFile() && /\.(jpg|jpeg|png|webp|svg|gif|avif)$/i.test(file)) {
              const url = `${urlPrefix}/${file}`;
              if (!existingUrls.has(url)) {
                images.push({
                  url,
                  name: file,
                  folder: folderName,
                });
                existingUrls.add(url);
              }
            }
          }
        }
      } catch (e) {
        // Safe directory scan ignore
      }
    };

    const cwd = process.cwd();
    const publicDir = fs.existsSync(path.join(cwd, "public"))
      ? path.join(cwd, "public")
      : path.join(cwd, "frontend", "public");

    // 1. Scan local directories
    scanDir(path.join(publicDir, "uploads"), "Uploads", "/uploads");
    scanDir(path.join(publicDir, "images", "lineups"), "Band Lineups", "/images/lineups");
    scanDir(path.join(publicDir, "images", "sound"), "Sound Setups", "/images/sound");
    scanDir(path.join(publicDir, "images"), "Hero & General", "/images");

    // 2. Query Firestore Media collection (picks up dynamic cloud uploads)
    const db = getAdminDb();
    if (db) {
      try {
        const snapshot = await db.collection("media").get();
        snapshot.forEach((doc) => {
          const url = `/uploads/${doc.id}`;
          if (!existingUrls.has(url)) {
            const data = doc.data();
            images.push({
              url,
              name: data?.fileName || doc.id,
              folder: "Uploads",
            });
            existingUrls.add(url);
          }
        });
      } catch (dbErr) {
        console.warn("[Media Library] Firestore media fetch warning:", dbErr);
      }
    }

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error("GET /api/admin/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch images list." },
      { status: 500 }
    );
  }
}
