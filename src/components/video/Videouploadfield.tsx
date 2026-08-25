"use client";

/**
 * VideoUploadField
 *
 * A self-contained form field that lets users either:
 *  (a) paste a YouTube / VK Video / Rutube URL, or
 *  (b) pick a local video file
 *
 * On success it calls `onChange` with the resolved VideoSource so the parent
 * form can do whatever it needs (e.g. store the URL + parsed fields before
 * sending them to a server action).
 *
 * Usage
 * ─────
 *   <VideoUploadField
 *     value={currentSource}
 *     onChange={(src) => form.setValue("videoSource", src)}
 *     onFileSelect={(file) => handleUpload(file)}   // optional — for local picks
 *   />
 *
 */

import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import VideoPlayer from "./Videoplayer";
import { parseVideoUrl, VideoSource } from "@/lib/video/utils";

// ─── Icons (inline SVG — no extra dep) ───────────────────────────────────────

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VideoUploadFieldProps {
  /** Current value (controlled). Pass undefined/null for empty state. */
  value?: VideoSource | null;

  /** Called whenever the resolved source changes (or is cleared). */
  onChange?: (source: VideoSource | null) => void;

  /**
   * Called when the user picks a local file (in addition to onChange).
   * Use this to trigger your upload handler and get the final storage URL,
   * then call onChange({ type: "local", src: uploadedUrl }).
   */
  onFileSelect?: (file: File) => void;

  /** Optional label shown above the field. */
  label?: string;

  /** Disable the whole field. */
  disabled?: boolean;

  /** Extra classes for the outer wrapper. */
  className?: string;

  /** Accept string for the file input. Defaults to "video/*". */
  accept?: string;
}

type Mode = "url" | "file";

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoUploadField({
  value,
  onChange,
  onFileSelect,
  label,
  disabled = false,
  className,
  accept = "video/*",
}: VideoUploadFieldProps) {
  const [mode, setMode] = useState<Mode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── URL parsing ────────────────────────────────────────────────────────────

  const handleUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setUrlInput(raw);
      setError(null);

      if (!raw.trim()) {
        onChange?.(null);
        return;
      }

      const result = parseVideoUrl(raw);
      console.log('res ', result)
      if (result.ok) {
        onChange?.(result.source);
      } else {
        // Don't show error while user is still typing (only when non-empty + settled)
        onChange?.(null);
      }
    },
    [onChange],
  );

  const handleUrlBlur = useCallback(() => {
    if (!urlInput.trim()) return;
    const result = parseVideoUrl(urlInput);
    if (!result.ok) setError(result.error);
  }, [urlInput]);

  // ── File picking ───────────────────────────────────────────────────────────

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file.");
        return;
      }
      setError(null);
      const objectUrl = URL.createObjectURL(file);
      onChange?.({ type: "local", url: objectUrl });
      onFileSelect?.(file);
    },
    [onChange, onFileSelect],
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // Drag & drop
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => setDragging(false), []);
  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // ── Clear ──────────────────────────────────────────────────────────────────

  const handleClear = useCallback(() => {
    setUrlInput("");
    setError(null);
    onChange?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [onChange]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const hasValue = !!value;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && (
        <Label className="text-sm font-medium text-zinc-200">{label}</Label>
      )}

      {/* Переключатель режима */}
      <div className="flex w-fit gap-1 rounded-lg bg-zinc-800/60 p-1">
        {(["url", "file"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            disabled={disabled}
            onClick={() => {
              setMode(m);
              handleClear();
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
              mode === m
                ? "bg-zinc-700 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            {m === "url" ? (
              <>
                <LinkIcon className="h-3.5 w-3.5" /> Вставить ссылку
              </>
            ) : (
              <>
                <UploadIcon className="h-3.5 w-3.5" /> Загрузить файл
              </>
            )}
          </button>
        ))}
      </div>

      {/* Поле URL */}
      {mode === "url" && (
        <div className="flex flex-col gap-1.5">
          <div className="relative flex items-center gap-2">
            <Input
              type="url"
              placeholder="https://youtube.com/watch?v=… или ссылка VK Video / Rutube"
              value={urlInput}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
              disabled={disabled}
              className={cn(
                "border-zinc-700 bg-zinc-900 pr-8 text-zinc-100 placeholder:text-zinc-500",
                "focus-visible:ring-zinc-500",
                error && "border-red-500 focus-visible:ring-red-500",
                hasValue &&
                  !error &&
                  "border-emerald-600 focus-visible:ring-emerald-600",
              )}
            />
            {/* Статус */}
            <span className="absolute right-2.5 flex items-center">
              {hasValue && !error && (
                <CheckIcon className="h-4 w-4 text-emerald-500" />
              )}
              {error && <XIcon className="h-4 w-4 text-red-500" />}
            </span>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          {!error && !hasValue && (
            <p className="text-xs text-zinc-500">
              Поддерживаются ссылки YouTube, VK Video и Rutube.
            </p>
          )}
        </div>
      )}

      {/* Зона загрузки файла */}
      {mode === "file" && (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Загрузка видеофайла"
          onClick={() => !disabled && fileInputRef.current?.click()}
          onKeyDown={(e) =>
            e.key === "Enter" && !disabled && fileInputRef.current?.click()
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed",
            "cursor-pointer px-6 py-8 text-center transition-colors duration-150",
            dragging
              ? "border-zinc-400 bg-zinc-800/60"
              : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-500 hover:bg-zinc-800/40",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          <UploadIcon className="h-8 w-8 text-zinc-500" />
          <div>
            <p className="text-sm font-medium text-zinc-300">
              Перетащите видео сюда или{" "}
              <span className="text-zinc-100 underline underline-offset-2">
                выберите файл
              </span>
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">MP4, WebM, MOV, AVI…</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={handleFileInput}
            disabled={disabled}
          />
        </div>
      )}

      {/* Превью */}
      {hasValue && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
              Предпросмотр
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="h-6 px-2 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <XIcon className="mr-1 h-3 w-3" />
              Очистить
            </Button>
          </div>

          <VideoPlayer source={value!} className="w-full" />
        </div>
      )}
    </div>
  );
}

export default VideoUploadField;
