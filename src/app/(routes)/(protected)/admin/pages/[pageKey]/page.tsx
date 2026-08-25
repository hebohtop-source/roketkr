import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/services/pageService";
import { pageSchemas, type PageKey } from "@/lib/types/pages";
import {
  defaultAboutData,
  defaultCertificatesData,
  defaultKitInstallationData,
  defaultVehicleData,
} from "@/lib/constants/defaultPageData";
import AboutPageEditor from "@/components/editors/AboutPageEditor";
import KitInstallationPageEditor from "@/components/editors/KitInstallationPageEditor";
import VehiclePageEditor from "@/components/editors/VehiclePageEditor";
import CertificatesPageEditor from "@/components/editors/CertificatesPageEditor";

function isValidPageKey(key: string): key is PageKey {
  return key in pageSchemas;
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ pageKey: string }>;
}) {
  const { pageKey } = await params;
  if (!isValidPageKey(pageKey)) notFound();

  const page = await getPageContent(pageKey);

  switch (pageKey) {
    case "about":
      return (
        <AboutPageEditor initialData={page?.content ?? defaultAboutData} />
      );
    case "kit-installation":
      return (
        <KitInstallationPageEditor
          initialData={page?.content ?? defaultKitInstallationData}
        />
      );
    case "vehicle-registration":
      return (
        <VehiclePageEditor initialData={page?.content ?? defaultVehicleData} />
      );
    case "certificates":
      return (
        <CertificatesPageEditor
          initialData={page?.content ?? defaultCertificatesData}
        />
      );
    default:
      notFound();
  }
}
