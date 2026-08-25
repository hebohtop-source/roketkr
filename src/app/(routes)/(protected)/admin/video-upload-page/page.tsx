"use client"

import { useState } from "react"
import { toast } from "sonner"

import VideoPlayer from "@/components/video/Videoplayer"
import VideoUploadField from "@/components/video/Videouploadfield"

import { addProductVideo } from "@/lib/services/videoService"
import {
  type VideoSelect,
  type VideoSource,
  videoSourceToInsert,
} from "@/lib/video/utils"

export default function VideoUploadPage() {
  const [video, setVideo] = useState<VideoSelect | null>(null)
  const [newVideoSource, setNewVideoSource] = useState<VideoSource | null>(null)
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!newVideoSource) return

    setIsUploading(true)

    try {
      const sourceFields = videoSourceToInsert(newVideoSource)

      const uploaded = await addProductVideo({
        ...sourceFields,
        productId: "dummy-id", // replace later
        isPrimary: true,
        file: newVideoFile ?? undefined,
      })

      setVideo(uploaded as VideoSelect)
      setNewVideoSource(null)
      setNewVideoFile(null)

      toast.success("Video uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Как проходит установка</h1>

      <VideoUploadField
        value={newVideoSource}
        onChange={(source, file) => {
          setNewVideoSource(source)
          setNewVideoFile(file ?? null)
        }}
      />

      <button
        onClick={handleUpload}
        disabled={!newVideoSource || isUploading}
        className="w-fit rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload Video"}
      </button>

      {video && (
        <div className="mt-4">
          <VideoPlayer
            video={video}
            className="aspect-video w-full overflow-hidden rounded-lg"
          />
        </div>
      )}
    </div>
  )
}
