"use client"
import { useEffect } from "react"
import { useSetProductName } from "@/components/shared/BreadCrumbsProductProvider"

export const RegisterProductName = ({ name }: { name: string }) => {
  const setProductName = useSetProductName()

  useEffect(() => {
    setProductName(name)
    return () => setProductName(undefined)
  }, [name])

  return null
}
