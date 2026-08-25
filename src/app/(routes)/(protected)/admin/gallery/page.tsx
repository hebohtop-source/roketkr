import GalleryEditor from "@/components/gallery/GalleryEditor";
import { galleryService } from "@/lib/services/galleryService";

const DashboardGalleryPage = async () => {
  const galleries = await galleryService.getActiveGalleries();

  return (
    <div className="mx-auto flex h-full max-w-screen-2xl justify-start bg-white max-xl:h-fit max-xl:flex-col">
      <GalleryEditor initialGalleries={galleries} />
    </div>
  );
};

export default DashboardGalleryPage;
