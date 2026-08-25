"use server"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function uploadProductImage(formData: FormData) {
  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`
  const path = join(process.cwd(), "public/uploads", filename)

  await writeFile(path, buffer)
  return `/uploads/${filename}`
}
