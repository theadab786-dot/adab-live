import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper to determine uploads directory reliably
function getUploadsDirectory(): string {
  const p1 = path.join(process.cwd(), "public", "uploads");
  const p2 = path.join(process.cwd(), "frontend", "public", "uploads");

  if (fs.existsSync(path.join(process.cwd(), "public"))) {
    return p1;
  }
  return p2;
}

// Ensure directory exists
function ensureUploadsDirectory(): string {
  const dir = getUploadsDirectory();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
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

    const uploadsDir = ensureUploadsDirectory();

    // Sanitize filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = path.extname(originalName) || ".jpg";
    const baseName = path.basename(originalName, ext);
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`.toLowerCase();
    const fullFilePath = path.join(uploadsDir, uniqueFileName);

    // Convert file to buffer and write
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.promises.writeFile(fullFilePath, buffer);

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

    const uploadsDir = getUploadsDirectory();
    const filePath = path.join(uploadsDir, fileName);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return NextResponse.json({
        success: true,
        message: `Image ${fileName} deleted successfully.`,
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "Image record removed (file was not on disk).",
      });
    }
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

    // Helper to scan directory
    const scanDir = (dirPath: string, folderName: string, urlPrefix: string) => {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          if (file.startsWith(".")) continue;
          const fullPath = path.join(dirPath, file);
          const stat = fs.statSync(fullPath);
          if (stat.isFile() && /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file)) {
            images.push({
              url: `${urlPrefix}/${file}`,
              name: file,
              folder: folderName,
            });
          }
        }
      }
    };

    const cwd = process.cwd();
    const publicDir = fs.existsSync(path.join(cwd, "public"))
      ? path.join(cwd, "public")
      : path.join(cwd, "frontend", "public");

    // 1. Scan uploads
    scanDir(path.join(publicDir, "uploads"), "Uploads", "/uploads");
    // 2. Scan lineups
    scanDir(path.join(publicDir, "images", "lineups"), "Band Lineups", "/images/lineups");
    // 3. Scan sound
    scanDir(path.join(publicDir, "images", "sound"), "Sound Setups", "/images/sound");
    // 4. Scan root images
    scanDir(path.join(publicDir, "images"), "Hero & General", "/images");

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error("GET /api/admin/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch images list." },
      { status: 500 }
    );
  }
}
