import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"

export const PopularModels = (car: any) => {
  return (
    <Link key={car.id} href={`/catalog?model=${car.slug}`} className="group">
      <Card className="relative h-48 overflow-hidden">
        {car?.imageUrl && (
          <Image
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"

          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <CardContent className="absolute bottom-0 left-0 p-3">
          <p className="font-bold text-sm text-white">
            {car.brand} {car.model}
          </p>
          <span className="text-xs text-blue-300 font-semibold group-hover:underline">
            Смотреть товары →
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}

