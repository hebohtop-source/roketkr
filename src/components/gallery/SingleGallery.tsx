import ImageUploadField from "@/components/ImageUploadField";
import { GalleryData } from "./types";
import { useSingleGallery } from "./useSingleGallery";

type Props = {
  initialGallery: GalleryData;
  onDeleted: (galleryId: string) => void;
};

export default function SingleGallery({ initialGallery, onDeleted }: Props) {
  const {
    gallery,
    isPending,
    deleteThisGallery,
    addImage,
    deleteImage,
    changeAltText,
    blurAltText,
    setPrimary,
    moveImage,
  } = useSingleGallery(initialGallery, onDeleted);

  return (
    <fieldset className="space-y-4 border-b pb-6">
      <legend className="flex w-full items-center justify-between font-semibold">
        {gallery.name}
        <button
          onClick={deleteThisGallery}
          disabled={isPending}
          className="text-sm text-red-600 disabled:opacity-50"
        >
          Удалить галлерею
        </button>
      </legend>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {gallery.images.map((img, i) => (
          <div key={img.id} className="space-y-2 rounded border p-2">
            <img
              src={img.url}
              alt={img.altText ?? ""}
              className="h-32 w-full rounded object-cover"
            />
            <input
              value={img.altText ?? ""}
              onChange={(e) => changeAltText(img.id, e.target.value)}
              onBlur={(e) => blurAltText(img.id, e.target.value)}
              placeholder="Alt text"
              className="w-full rounded border p-1 text-sm"
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`primary-${gallery.id}`}
                  checked={img.isPrimary}
                  onChange={() => setPrimary(img.id)}
                />
                Главная
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => moveImage(img.id, -1)}
                  disabled={i === 0}
                  className="disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveImage(img.id, 1)}
                  disabled={i === gallery.images.length - 1}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteImage(img.id)}
                  className="text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImageUploadField
        value=""
        folder="gallery"
        onChange={addImage}
        label="Добавить картинку"
      />
    </fieldset>
  );
}
