import { video } from "@/db/schema";
import type { VideoSourceType } from "@/db/schema";

// ─── Types ────────────────────────────────────────────────────────────────────

export type VideoSelect = typeof video.$inferSelect;
export type VideoInsert = typeof video.$inferInsert;

export function buildEmbedUrl(source: VideoSource, autoplay = true): string {
  const ap = autoplay ? 1 : 0;
  switch (source.type) {
    case "youtube":
      return `https://www.youtube.com/embed/${source.videoId}?autoplay=${ap}&mute=1`;
    case "rutube":
      return `https://rutube.ru/play/embed/${source.videoId}?autoPlay=${ap}`;
    case "vkvideo": {
      const base = `https://vk.com/video_ext.php?oid=${source.ownerId}&id=${source.videoId}&autoplay=${ap}`;
      return source.hash ? `${base}&hash=${source.hash}` : base;
    }
    case "local":
      return source.url;
  }
}

export function buildThumbnailUrl(source: VideoSource): string | null {
  switch (source.type) {
    case "youtube":
      return `https://img.youtube.com/vi/${source.videoId}/hqdefault.jpg`;
    case "rutube":
      return `https://pic.rutube.ru/video/${source.videoId}/thumb.jpg`;
    case "vkvideo":
    case "local":
      return null; // caller should fall back to placeholderUrl from DB
  }
}

/**
 * Discriminated union consumed by <VideoPlayer> and all video utilities.
 *
 * `local`   → url  is the file path / storage URL  (e.g. "/uploads/video.mp4")
 * `youtube` → videoId is the part after ?v=        (e.g. "dQw4w9WgXcQ")
 * `vkvideo` → videoId + ownerId (+ optional hash)
 * `rutube`  → videoId is the UUID slug             (e.g. "af7d7bc0…")
 */
export type VideoSource =
  | { type: "youtube"; videoId: string }
  | { type: "rutube"; videoId: string }
  | { type: "vkvideo"; videoId: string; ownerId: string; hash?: string }
  | { type: "local"; url: string };

export type ParseResult =
  | { ok: true; source: VideoSource }
  | { ok: false; error: string };

// Explicit type — avoids Drizzle's $inferInsert making sourceType optional/undefined
export type VideoSourceInsertFields = {
  sourceType: VideoSourceType;
  url: string | null;
  videoId: string | null;
  ownerId: string | null;
  hash: string | null;
};

// ─── Individual URL parsers ───────────────────────────────────────────────────

/**
 * Supported patterns:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 */
function parseYouTube(url: URL): VideoSource | null {
  const { hostname, pathname, searchParams } = url;

  const isYT =
    hostname === "youtube.com" ||
    hostname === "www.youtube.com" ||
    hostname === "youtu.be" ||
    hostname === "www.youtube-nocookie.com";

  if (!isYT) return null;

  // youtu.be/VIDEO_ID
  if (hostname === "youtu.be") {
    const id = pathname.slice(1).split("?")[0];
    if (id) return { type: "youtube", videoId: id };
  }

  // /watch?v=VIDEO_ID
  const v = searchParams.get("v");
  if (v) return { type: "youtube", videoId: v };

  // /embed/VIDEO_ID  or  /shorts/VIDEO_ID  or  /v/VIDEO_ID
  const embedMatch = pathname.match(/\/(?:embed|shorts|v)\/([^/?&]+)/);
  if (embedMatch) return { type: "youtube", videoId: embedMatch[1] };

  return null;
}

/**
 * Supported patterns:
 *   https://vkvideo.ru/video-OWNERID_VIDEOID
 *   https://vk.com/video-OWNERID_VIDEOID
 *   https://vkvideo.ru/video_ext.php?oid=OWNERID&id=VIDEOID&hash=HASH
 *   https://vk.com/video_ext.php?oid=OWNERID&id=VIDEOID
 */
function parseVKVideo(url: URL): VideoSource | null {
  const { hostname, pathname, searchParams } = url;

  const isVK =
    hostname === "vk.com" ||
    hostname === "www.vk.com" ||
    hostname === "vkvideo.ru" ||
    hostname === "www.vkvideo.ru";

  if (!isVK) return null;

  // Embed URL: /video_ext.php?oid=OWNERID&id=VIDEOID[&hash=HASH]
  if (pathname.includes("video_ext.php")) {
    const ownerId = searchParams.get("oid");
    const videoId = searchParams.get("id");
    const hash = searchParams.get("hash") ?? undefined;
    if (ownerId && videoId) return { type: "vkvideo", ownerId, videoId, hash };
  }

  // Watch URL: /video-OWNERID_VIDEOID  or  /videoOWNERID_VIDEOID
  const watchMatch = pathname.match(/\/video(-?\d+)_(\d+)/);

  if (watchMatch) {
    return { type: "vkvideo", ownerId: watchMatch[1], videoId: watchMatch[2] };
  }

  return null;
}

/**
 * Supported patterns:
 *   https://rutube.ru/video/VIDEO_ID/
 *   https://rutube.ru/play/embed/VIDEO_ID
 */
function parseRutube(url: URL): VideoSource | null {
  const { hostname, pathname } = url;

  const isRT = hostname === "rutube.ru" || hostname === "www.rutube.ru";
  if (!isRT) return null;

  const match = pathname.match(/\/(?:video|play\/embed)\/([a-f0-9]{32,})\/?/);
  if (match) return { type: "rutube", videoId: match[1] };

  return null;
}

// ─── Main parser ──────────────────────────────────────────────────────────────

/**
 * Parses a user-pasted URL and returns a typed VideoSource (or an error).
 * Safe to use on both server and client — no DOM dependencies.
 */
export function parseVideoUrl(raw: string): ParseResult {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { ok: false, error: "Please enter a URL." };
  }

  // Local / blob / data URLs — pass through directly
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return { ok: true, source: { type: "local", url: trimmed } };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid URL — please check the link." };
  }

  const source = parseYouTube(url) ?? parseVKVideo(url) ?? parseRutube(url);
  if (source) return { ok: true, source };

  return {
    ok: false,
    error:
      "Unrecognised video URL. Supported sources: YouTube, VK Video, Rutube, or a local path.",
  };
}

// ─── DB row → VideoSource ─────────────────────────────────────────────────────

/**
 * Converts a `video` DB row (as returned by Drizzle) into the VideoSource
 * discriminated union consumed by <VideoPlayer>.
 */
export function rowToVideoSource(row: VideoSelect): VideoSource | null {
  switch (row.sourceType) {
    case "local":
      if (!row.url) return null;
      return { type: "local", url: row.url };

    case "youtube":
      if (!row.videoId) return null;
      return { type: "youtube", videoId: row.videoId };

    case "vkvideo":
      if (!row.ownerId || !row.videoId) return null;
      return {
        type: "vkvideo",
        ownerId: row.ownerId,
        videoId: row.videoId,
        hash: row.hash ?? undefined,
      };

    case "rutube":
      if (!row.videoId) return null;
      return { type: "rutube", videoId: row.videoId };

    default:
      return null;
  }
}

// ─── VideoSource → DB insert fields ──────────────────────────────────────────

/**
 * Maps a parsed VideoSource back to the fields needed for a DB insert.
 * Merge with additional fields (productId, sortOrder, …) before inserting.
 *
 * @example
 * const result = parseVideoUrl(input);
 * if (!result.ok) return;
 * await db.insert(video).values({
 *   id: newId(),
 *   productId,
 *   ...videoSourceToInsert(result.source),
 * });
 */
export function videoSourceToInsert(
  source: VideoSource,
): VideoSourceInsertFields {
  switch (source.type) {
    case "local":
      return {
        sourceType: "local",
        url: source.url,
        videoId: null,
        ownerId: null,
        hash: null,
      };
    case "youtube":
      return {
        sourceType: "youtube",
        url: null,
        videoId: source.videoId,
        ownerId: null,
        hash: null,
      };
    case "vkvideo":
      return {
        sourceType: "vkvideo",
        url: null,
        videoId: source.videoId,
        ownerId: source.ownerId,
        hash: source.hash ?? null,
      };
    case "rutube":
      return {
        sourceType: "rutube",
        url: null,
        videoId: source.videoId,
        ownerId: null,
        hash: null,
      };
  }
}
