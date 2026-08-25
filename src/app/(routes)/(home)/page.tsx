export const dynamic = 'force-dynamic'

import { ContactSection } from "@/components/sections/Contact";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { Promotions } from "@/components/sections/Promotions";
import { Reviews } from "@/components/sections/Reviews";
import { Catalog } from "@/components/sections/Catalog";
import { Advantages } from "@/components/sections/Advantages";
import { Params } from "next/dist/server/request/params";
import { PopularModelsVideo } from "@/components/carousel/video-carousel/section/PopularModelsVideo";

export default async function HomePage() {

  return (
    <div>
      <PhotoGallery />
      <PopularModelsVideo />
      <Catalog />
      <Promotions />
      <Advantages />
      <Reviews />
      <ContactSection />
    </div>
  );
}
