export type ImageData = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

// Anything that "owns" a set of images just needs an id + images array
export type ImageOwner = {
  id: string;
  images: ImageData[];
};

export type GalleryData = ImageOwner & {
  name: string;
  description: string | null;
};

// Trim to whatever product fields the UI actually needs to show
export type ProductImagesData = ImageOwner & {
  name: string;
};
