"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface Props {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goTo = (page: number) => {
    const next = new URLSearchParams(searchParams.toString())
    if (page === 1) next.delete("page")
    else next.set("page", String(page))
    router.push(`${pathname}?${next.toString()}`)
    onPageChange?.(page)
  }

  const pages: (number | "...")[] = []
  if (totalPages <= 7) {
    pages.push(...Array.from({ length: totalPages }, (_, i) => i + 1))
  } else if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", totalPages)
  } else if (currentPage >= totalPages - 3) {
    pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
  }

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 w-full flex-wrap">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 disabled:opacity-50 hover:cursor-pointer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center font-manrope text-base text-[#222]">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-3xl font-manrope text-base  hover:cursor-pointer",
              p === currentPage ? "bg-[#0661CA] text-white" : "text-[#222]"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 disabled:opacity-50  hover:cursor-pointer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
