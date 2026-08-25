/**
 * Storage abstraction layer.
 *
 * Locally: images live in /public/uploads — just drop files there.
 * To migrate: swap out the functions below for S3/Cloudinary/R2/etc.
 * The rest of your app never changes.
 *
 * Usage:
 *   import { getImageUrl, listImages } from "@/lib/storage";
 *   const url = getImageUrl("avatar.png");  // → /uploads/avatar.png (local)
 *                                           // → https://cdn.example.com/avatar.png (prod)
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const LOCAL_BASE_PATH = "/uploads"; // served by Next.js from /public/uploads

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Resolves a stored filename/path to a fully-qualified URL.
 * This is the function your components & API routes call.
 */
export function getImageUrl(storedPath: string): string {
  // storedPath is what you save in the DB — e.g. "avatar.png" or "products/hero.jpg"
  return `${LOCAL_BASE_PATH}/${storedPath}`;
}

/**
 * Inverse of getImageUrl: strips the base prefix so you get back the
 * storable path to put in the DB.
 */
export function toStoredPath(url: string): string {
  const prefix = `${LOCAL_BASE_PATH}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : url;
}
/**
 * Returns all image filenames available in the local uploads folder.
 * Server-side only — do not call from client components.
 * 
 */
export async function listImages(subfolder?: string): Promise<string[]> {
  // Dynamic import keeps `fs` out of client bundles
  const fs = await import("fs/promises");
  const path = await import("path");

  const uploadsDir = path.join(process.cwd(), "public", "uploads", subfolder ?? "");

  try {
    const entries = await fs.readdir(uploadsDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && isImageFile(e.name))
      .map((e) => (subfolder ? `${subfolder}/${e.name}` : e.name));
  } catch {
    return []; // folder doesn't exist yet → treat as empty
  }
}

// ---------------------------------------------------------------------------
// Internal utils
// ---------------------------------------------------------------------------

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"]);

function isImageFile(filename: string): boolean {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

// ---------------------------------------------------------------------------
// Migration guide (swap the implementations above, keep the signatures)
// ---------------------------------------------------------------------------
//
// S3 / R2:
//   getImageUrl(key) → `https://${BUCKET}.s3.amazonaws.com/${key}`
//   listImages()     → s3.send(new ListObjectsV2Command({ Bucket }))
//
// Cloudinary:
//   getImageUrl(key) → cloudinary.url(key)
//   upload(file)     → cloudinary.uploader.upload(file)
//
// Vercel Blob:
//   getImageUrl(key) → the blob URL you stored in the DB
//   upload(file)     → put(key, file, { access: "public" })
