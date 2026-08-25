// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string | null) ?? ""; // optional, defaults to old root behavior

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 415 },
    );
  }

  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

  const uploadDir = path.join(process.cwd(), "public/uploads", safeFolder);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  // const url = safeFolder
  //   ? `/uploads/${safeFolder}/${filename}`
  //   : `/uploads/${filename}`;
  const url = filename;
  let dimensions: { width: number; height: number } | null = null;
  if (isImage) {
    try {
      const sharp = (await import("sharp")).default;
      const meta = await sharp(bytes).metadata();
      if (meta.width && meta.height)
        dimensions = { width: meta.width, height: meta.height };
    } catch {
      // sharp not installed, or unreadable metadata — non-fatal, just skip dims
    }
  }

  return NextResponse.json({
    url,
    ...(dimensions && { width: dimensions.width, height: dimensions.height }),
  });
}
