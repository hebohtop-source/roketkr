"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoUploadField } from "@/components/video/Videouploadfield";
import { VideoPlayer } from "@/components/video/Videoplayer";
import {
  rowToVideoSource,
  videoSourceToInsert,
  type VideoSource,
} from "@/lib/video/utils";
import {
  createCarModelVideoAction,
  deleteCarModelVideo,
} from "@/lib/services/videoService";
import type { video } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type VideoRow = InferSelectModel<typeof video>;

export function CarModelVideosManager({
  carModelId,
  videos,
}: {
  carModelId: string;
  videos: VideoRow[];
}) {
  const router = useRouter();
  const [source, setSource] = useState<VideoSource | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!source) return;
    setError(null);
    startTransition(async () => {
      try {
        await createCarModelVideoAction({
          ...videoSourceToInsert(source),
          carModelId,
          file: source.type === "local" ? (file ?? undefined) : undefined,
        });
        setSource(null);
        setFile(null);
        router.refresh();
      } catch {
        setError("Не удалось добавить видео. Попробуйте снова.");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteCarModelVideo(id);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {videos.map((v) => {
          const src = rowToVideoSource(v);
          return (
            <div key={v.id} className="flex flex-col gap-2">
              {src ? (
                <VideoPlayer source={src} className="aspect-video w-full rounded-lg" />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-400">
                  Не удалось прочитать видео
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(v.id)}
                disabled={isPending}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Удалить
              </Button>
            </div>
          );
        })}
        {videos.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">
            Видео по установке для этой модели пока не добавлены.
          </p>
        )}
      </div>

      <div className="rounded-lg border bg-zinc-50 p-4">
        <VideoUploadField
          label="Добавить видео установки"
          value={source}
          onChange={setSource}
          onFileSelect={setFile}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <Button
          type="button"
          className="mt-3"
          onClick={handleAdd}
          disabled={!source || isPending}
        >
          {isPending ? "Добавление..." : "Добавить видео"}
        </Button>
      </div>
    </div>
  );
}
