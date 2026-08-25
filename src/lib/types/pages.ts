import { z } from "zod";

export const aboutPageSchema = z.object({
  meta: z.object({ title: z.string(), description: z.string() }),
  sections: z.array(
    z.object({
      id: z.enum(["who-we-are", "approach", "section3"]),
      heading: z.string(),
      text: z.string(),
      image: z.string(),
    }),
  ),
});

export const kitInstallationPageSchema = z.object({
  meta: z.object({ title: z.string(), description: z.string() }),
  videoUrl: z.string(),
  stepsHeading: z.string(),
  steps: z.array(
    z.object({
      id: z.enum(["step-1", "step-2", "step-3", "step-4"]),
      title: z.string(),
      desc: z.string(),
    }),
  ),
  modelsHeading: z.string(),
});

export const vehiclePageSchema = z.object({
  meta: z.object({ title: z.string(), description: z.string() }),
  intro: z.object({
    heading: z.string(),
    text: z.string(),
    videoUrl: z.string(),
  }),
  stepsHeading: z.string(),
  steps: z.array(
    z.object({
      id: z.enum(["step-1", "step-2", "step-3", "step-4"]),
      title: z.string(),
      desc: z.string(),
    }),
  ),
});

export const certificatesPageSchema = z.object({
  meta: z.object({ title: z.string(), description: z.string() }),
  pageHeading: z.string(),
  intro: z.object({
    heading: z.string(),
    text: z.string(),
  }),
  certificates: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      altText: z.string(),
    }),
  ),
});

export const pageSchemas = {
  about: aboutPageSchema,
  "kit-installation": kitInstallationPageSchema,
  "vehicle-registration": vehiclePageSchema,
  certificates: certificatesPageSchema,
} as const;

export type VehiclePageData = PageData<"vehicle-registration">;
export type VehicleStep = VehiclePageData["steps"][number];

export type PageKey = keyof typeof pageSchemas;
export type PageData<K extends PageKey> = z.infer<(typeof pageSchemas)[K]>;
export type AboutPageData = PageData<"about">;
export type AboutSection = AboutPageData["sections"][number];
export type KitInstallationPageData = PageData<"kit-installation">;
export type KitInstallationStep = KitInstallationPageData["steps"][number];
export type CertificatesPageData = PageData<"certificates">;
export type CertificateItem = CertificatesPageData["certificates"][number];
