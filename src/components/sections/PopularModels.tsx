import Link from "next/link"
import { carModel, category, product, productCarCompatibility } from "@/db/schema"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import Image from "next/image"
import { Card, CardContent } from "../ui/card"
import React from "react"

async function getCategoriesForCarModel(carModelId: string) {
  return db
    .select({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })
    .from(category)
    .innerJoin(product, eq(product.categoryId, category.id))
    .innerJoin(productCarCompatibility, eq(productCarCompatibility.productId, product.id))
    .where(eq(productCarCompatibility.carModelId, carModelId))
    .groupBy(category.id, category.name, category.slug)

}

export const PopularModels = async () => {
  const POPULAR_MODELS = await db
    .select()
    .from(carModel)
    .where(eq(carModel.isPopular, true))
    .limit(4)

  const modelsWithCategories = await Promise.all(
    POPULAR_MODELS.map(async (car) => {
      const categories = await getCategoriesForCarModel(car.id)
      return ({
        ...car,
        categories,
      })
    })
  )

  return (
    <section className="section-margin-bottom">
      {/* <h2 className="section-heading mb-5">Популярные модели</h2> */}
      <h2 className="section-heading mb-5">Популярные модели</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {modelsWithCategories.map((car) => (

          <div key={car.id} className="group relative">
            <Card className="relative sm:h-150 md:h-80 lg:h-150 h-80 overflow-hidden">
              {car?.imageUrl && (
                <Image
                  src={car.imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <CardContent className="absolute bottom-0 left-0 pb-4 w-full">
                <Link href={`/catalog?model=${car.slug}`} className="block">
                  <p className="popular-models-title mb-3">
                    {car.brand} {car.model}
                  </p>
                </Link>
                {car.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {car.categories.map((cat, index) => (
                      <React.Fragment key={cat.id}>
                        {index > 0 && (
                          <span className="popular-models-pills pointer-events-none">{" • "}</span>
                        )}
                        <Link
                          href={`/catalog/${cat.slug}?model=${car.slug}`}
                          className="popular-models-pills"

                        >
                          {cat.name}
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                )}
                <Link
                  href={`/catalog?model=${car.slug}&categories=${car.categories.map(c => c.slug).join(",")}`}
                  className="popular-models-pill-link block"
                >
                  Смотреть товары →
                </Link>
              </CardContent>
            </Card>

          </div>
        ))}
      </div>
    </section>
  )
}
