import { RawGalleryInner } from "@/components/sections/RawGalleryInner"

const docItems = [
  { id: 1, slug: "", imageUrl: "/doc.png", name: "Документ 1" },
  { id: 2, slug: "", imageUrl: "/doc.png", name: "Документ 2" },
  { id: 3, slug: "", imageUrl: "/doc.png", name: "Документ 3" },
  { id: 4, slug: "", imageUrl: "/doc.png", name: "Документ 4" },
  { id: 12, slug: "", imageUrl: "/doc.png", name: "Документ 1" },
  { id: 22, slug: "", imageUrl: "/doc.png", name: "Документ 2" },
  { id: 32, slug: "", imageUrl: "/doc.png", name: "Документ 3" },
  { id: 42, slug: "", imageUrl: "/doc.png", name: "Документ 4" },
]

export function DocGallery() {
  return (
    <RawGalleryInner
      imageItems={docItems}
      title="Документы"
      itemsPerView={4}
      aspectRatio="a4"
    />
  )
}
