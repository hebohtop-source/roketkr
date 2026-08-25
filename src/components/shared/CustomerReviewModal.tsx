
"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CustomerReviewForm } from "../CustomerReviewForm"


export function CustomerReviewModal({ productId, trigger }: {
  productId: string
  trigger: React.ReactNode
}) {


  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Оставить отзыв</DialogTitle>
        </DialogHeader>
        <CustomerReviewForm productId={productId} />
      </DialogContent>
    </Dialog>
  )
}
