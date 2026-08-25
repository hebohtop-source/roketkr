"use server"

import { db } from "@/db"
import { VideoSourceType, video } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { VideoSourceInsertFields } from "../video/utils"
import path from "path"
import fs from "fs/promises"



type CreateVideoPayload = {
  // source fields (from videoSourceToInsert)
  sourceType: VideoSourceType
  url: string | null
  videoId: string | null
  ownerId: string | null
  hash: string | null
  // associations
  carModelId: string
  productId?: string
  // metadata
  altText?: string
  isPrimary?: boolean
  sortOrder?: number
  // local upload only
  file?: File
}

export async function createCarModelVideoAction(payload: CreateVideoPayload) {
  let finalUrl = payload.url

  if (payload.sourceType === "local" && payload.file) {
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadDir, { recursive: true })

    const ext = path.extname(payload.file.name) || ".mp4"
    const filename = `${crypto.randomUUID()}${ext}`
    const filepath = path.join(uploadDir, filename)

    const buffer = Buffer.from(await payload.file.arrayBuffer())
    await fs.writeFile(filepath, buffer)

    finalUrl = `/uploads/${filename}`
  }

  const [inserted] = await db
    .insert(video)
    .values({
      sourceType: payload.sourceType,
      url: finalUrl,
      videoId: payload.videoId,
      ownerId: payload.ownerId,
      hash: payload.hash,
      carModelId: payload.carModelId,
      productId: payload.productId ?? null,
      altText: payload.altText ?? null,
      isPrimary: payload.isPrimary ?? false,
      sortOrder: payload.sortOrder ?? 0,
    })
    .$returningId()   // MySQL — returns { id }

  revalidatePath("/admin/car-models")
  revalidatePath("/kit-installation")

  return { id: inserted.id, url: finalUrl }
}

export async function getCarModelVideos(carModelId: string) {
  return db.query.video.findMany({
    where: eq(video.carModelId, carModelId),
    orderBy: (v, { asc }) => [asc(v.sortOrder)],
  })
}

export async function deleteCarModelVideo(videoId: string) {
  await db.delete(video).where(eq(video.id, videoId))
  revalidatePath("/admin/car-models")
  revalidatePath("/kit-installation")
}

type AddProductVideoPayload = VideoSourceInsertFields & {
  productId: string
  altText?: string
  isPrimary?: boolean
  sortOrder?: number
  file?: File
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function addProductVideo(payload: AddProductVideoPayload) {
  let finalUrl = payload.url

  if (payload.sourceType === "local" && payload.file) {
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadDir, { recursive: true })

    const ext = path.extname(payload.file.name) || ".mp4"
    const filename = `${crypto.randomUUID()}${ext}`
    const filepath = path.join(uploadDir, filename)

    const buffer = Buffer.from(await payload.file.arrayBuffer())
    await fs.writeFile(filepath, buffer)

    finalUrl = `/uploads/${filename}`
  }

  const [inserted] = await db
    .insert(video)
    .values({
      sourceType: payload.sourceType,
      url: finalUrl,
      videoId: payload.videoId,
      ownerId: payload.ownerId,
      hash: payload.hash,
      productId: payload.productId,
      altText: payload.altText ?? null,
      isPrimary: payload.isPrimary ?? false,
      sortOrder: payload.sortOrder ?? 0,
    })
    .$returningId()

  return {
    id: inserted.id,
    sourceType: payload.sourceType,
    url: finalUrl,
    videoId: payload.videoId,
    ownerId: payload.ownerId,
    hash: payload.hash,
    altText: payload.altText ?? null,
    isPrimary: payload.isPrimary ?? false,
  }
}

export async function deleteProductVideo(videoId: string) {
  await db.delete(video).where(eq(video.id, videoId))
}

export async function setProductPrimaryVideo(videoId: string, productId: string) {
  await db
    .update(video)
    .set({ isPrimary: false })
    .where(eq(video.productId, productId))

  await db
    .update(video)
    .set({ isPrimary: true })
    .where(and(eq(video.id, videoId), eq(video.productId, productId)))
}

