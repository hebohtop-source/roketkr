
import { BreadCrumbs } from "@/components/shared/BreadCrumbs"
import { BreadCrumbsProductProvider } from "@/components/shared/BreadCrumbsProductProvider"
import { db } from "@/db"
import { category } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function InnerPageLayout({ children }: { children: React.ReactNode }) {
  // const categories = await db
  //   .select({ slug: category.slug, name: category.name })
  //   .from(category)
  //   .where(eq(category.isActive, true))
  const categories = []

  return (
    <BreadCrumbsProductProvider>
      <BreadCrumbs categories={categories} />
      {children}
    </BreadCrumbsProductProvider>
  )
}
