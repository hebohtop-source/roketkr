"use client"

import { useState, useTransition } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"



import { createCarModelVideoAction } from "@/lib/services/videoService"
import { videoSourceToInsert, rowToVideoSource } from "@/lib/video/utils"
import VideoPlayer, { VideoSource } from "./video/Videoplayer"
import VideoUploadField from "./video/Videouploadfield"

// ─── Types ────────────────────────────────────────────────────────────────────

type CarModel = {
  id: string
  brand: string
  model: string
}

// Shape of a row as returned by your DB query (and optimistically added)
type VideoRow = {
  id: string
  sourceType: string
  url: string | null
  videoId: string | null
  ownerId: string | null
  hash: string | null
  altText: string | null
  isPrimary: boolean
  carModelName: string | null
}

type Props = {
  initialVideos: VideoRow[]
  carModels: CarModel[]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoAdminPanel({ initialVideos, carModels }: Props) {
  const [videos, setVideos] = useState(initialVideos)
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [altText, setAltText] = useState("")
  const [carModelId, setCarModelId] = useState("")
  const [isPrimary, setIsPrimary] = useState(false)
  const [isPending, startTransition] = useTransition()

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!carModelId || !videoSource) return

    // videoSourceToInsert maps VideoSource → the DB columns
    const sourceFields = videoSourceToInsert(videoSource)

    startTransition(async () => {
      const res = await createCarModelVideoAction({
        ...sourceFields,
        carModelId,
        altText,
        isPrimary,
        // pass the raw file for local uploads so the server action
        // can upload it to storage and get a real URL back
        file: uploadedFile ?? undefined,
      })

      // Optimistic row — same shape as VideoRow
      setVideos((prev) => [
        {
          id: res.id,
          sourceType: sourceFields.sourceType,
          url: sourceFields.url ?? null,
          videoId: sourceFields.videoId ?? null,
          ownerId: sourceFields.ownerId ?? null,
          hash: sourceFields.hash ?? null,
          altText,
          isPrimary,
          carModelName:
            carModels.find((c) => c.id === carModelId)?.model ?? "—",
        },
        ...prev,
      ])

      // Reset form
      setVideoSource(null)
      setUploadedFile(null)
      setAltText("")
      setIsPrimary(false)
    })
  }

  const canSave = !isPending && !!carModelId && !!videoSource

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* ── Upload panel ── */}
      <div className="border rounded-xl p-4 flex flex-col gap-4">

        {/* Car model selector */}
        <div className="flex flex-col gap-1.5">
          <Label>Модель автомобиля</Label>
          <Select onValueChange={setCarModelId}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите модель автомобиля" />
            </SelectTrigger>
            <SelectContent>
              {carModels.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.brand} {c.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/*
          VideoUploadField handles both modes (URL paste / file upload).
          onChange gives us the parsed VideoSource.
          onFileSelect stores the raw File so we can pass it to the server action.
        */}
        <VideoUploadField
          label="Видео"
          value={videoSource}
          onChange={setVideoSource}
          onFileSelect={(file) => setUploadedFile(file)}
          disabled={isPending}
        />

        {/* Alt text */}
        <div className="flex flex-col gap-1.5">
          <Label>Описание</Label>
          <Input
            placeholder="Описание видео"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            disabled={isPending}
          />
        </div>

        {/* Primary toggle */}
        <div className="flex items-center gap-2">
          <Switch
            id="isPrimary"
            checked={isPrimary}
            onCheckedChange={setIsPrimary}
            disabled={isPending}
          />
          <Label htmlFor="isPrimary">Основное видео</Label>
        </div>

        <Button onClick={handleSave} disabled={!canSave}>
          {isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="border rounded-xl overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Видео</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Основное</TableHead>
              <TableHead>Модель авто</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {videos.map((v) => {

              const src = rowToVideoSource(v)

              return (
                <TableRow key={v.id}>
                  <TableCell>
                    {src ? (
                      <VideoPlayer
                        source={src}
                        className="w-full max-w-[260px]"
                        aspectRatio="16 / 9"
                        controls
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {v.altText ?? "—"}
                  </TableCell>

                  <TableCell>
                    {v.isPrimary ? (
                      <Badge className="bg-green-500">Да</Badge>
                    ) : (
                      <Badge variant="secondary">Нет</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {v.carModelName ?? "—"}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
