import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// ── Config ───────────────────────────────────────────────────────────────────
// Must match LOCAL_BASE_PATH in your schema (db/schema.ts) — the prefix that
// imagePath's fromDriver() prepends when reading values back out of the DB.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
]);

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-matroska": "mkv",
};

function getFileKind(mime: string): "image" | "video" | null {
  if (ALLOWED_IMAGE_MIME_TYPES.has(mime)) return "image";
  if (ALLOWED_VIDEO_MIME_TYPES.has(mime)) return "video";
  return null;
}

// ── Route ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const kind = getFileKind(file.type);
    if (!kind) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Allowed images: JPEG, PNG, WEBP, GIF. Allowed videos: MP4, WEBM, MOV, MKV",
        },
        { status: 400 },
      );
    }

    const maxSize = kind === "image" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB for ${kind}s`,
        },
        { status: 400 },
      );
    }

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const extension = EXTENSION_BY_MIME[file.type];
    const filename = `${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Return BOTH forms:
    // - `filename`: the bare name to store in DB columns using the `imagePath`
    //   custom type (its fromDriver() will prepend /uploads/ automatically).
    // - `url`: the full public path, for any client code that wants to preview
    //   the file immediately without round-tripping through the DB.
    return NextResponse.json({
      filename,
      url: `/uploads/${filename}`,
      type: kind,
      mimeType: file.type,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
