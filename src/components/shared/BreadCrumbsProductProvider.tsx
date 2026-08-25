// components/shared/BreadCrumbsProductProvider.tsx
"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ContextValue = {
  productName: string | undefined
  setProductName: (name: string | undefined) => void
}

const ProductNameContext = createContext<ContextValue>({
  productName: undefined,
  setProductName: () => { },
})

export const useProductName = () => useContext(ProductNameContext).productName

export const BreadCrumbsProductProvider = ({ children }: { children: ReactNode }) => {
  const [productName, setProductName] = useState<string | undefined>(undefined)
  return (
    <ProductNameContext.Provider value={{ productName, setProductName }}>
      {children}
    </ProductNameContext.Provider>
  )
}


export const useSetProductName = () => useContext(ProductNameContext).setProductName
