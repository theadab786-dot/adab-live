import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminDb, getAdminStorage } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Guard against path traversal
    if (
      !filename ||
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    // 1. Check local filesystem first (for local development or pre-built static files)
    try {
      const p1 = path.join(process.cwd(), "public", "uploads", filename);
      const p2 = path.join(process.cwd(), "frontend", "public", "uploads", filename);
      const diskPath = fs.existsSync(p1) ? p1 : fs.existsSync(p2) ? p2 : null;
      if (diskPath) {
        const fileBuffer = await fs.promises.readFile(diskPath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": getMimeType(filename),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch (diskErr) {
      // Local disk read failed; fallback to cloud storage
    }

    // 2. Fetch from Firestore Media collection (Persistent in serverless environments like Vercel)
    const db = getAdminDb();
    if (db) {
      try {
        const docRef = db.collection("media").doc(filename);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const docData = docSnap.data();
          const contentType = docData?.contentType || getMimeType(filename);

          if (docData?.isChunked) {
            // Reassemble chunked file
            const chunksSnap = await docRef
              .collection("chunks")
              .orderBy("index", "asc")
              .get();
            let fullBase64 = "";
            chunksSnap.forEach((c) => {
              fullBase64 += c.data()?.data || "";
            });
            const buffer = Buffer.from(fullBase64, "base64");
            return new NextResponse(buffer, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          } else if (docData?.data) {
            // Single document file
            const buffer = Buffer.from(docData.data, "base64");
            return new NextResponse(buffer, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }
        }
      } catch (dbErr) {
        console.warn("[Media Serve] Firestore media read error:", dbErr);
      }
    }

    // 3. Fallback: Firebase Cloud Storage bucket (if bucket is active)
    try {
      const storage = getAdminStorage();
      if (storage) {
        const bucket = storage.bucket();
        const [exists] = await bucket.exists();
        if (exists) {
          const fileRef = bucket.file(`uploads/${filename}`);
          const [fileExists] = await fileRef.exists();
          if (fileExists) {
            const [buffer] = await fileRef.download();
            return new NextResponse(buffer, {
              status: 200,
              headers: {
                "Content-Type": getMimeType(filename),
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }
        }
      }
    } catch (storageErr) {
      // Storage fallback failed
    }

    return new NextResponse("File not found", { status: 404 });
  } catch (error: any) {
    console.error("GET /uploads/[filename] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
