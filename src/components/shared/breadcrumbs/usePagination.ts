
import { useState, useEffect } from "react"

export function usePagination(initialPage: number, initialTotal: number) {
  const [pages, setPages] = useState({ current: initialPage, total: initialTotal })

  useEffect(() => {
    setPages({ current: initialPage, total: initialTotal })
  }, [initialPage, initialTotal])

  return {
    currentPage: pages.current,
    totalPages: pages.total,
    setPages,
  }
}
