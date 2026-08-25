import { FloatingSocials } from "@/components/sections/FloatingSocials";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/shared/hero";
import { getCategories } from "@/lib/services/categoryService";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const CATEGORIES = await getCategories();
  return (
    <>
      <Hero />
      <FloatingSocials />
      <div
        data-page-container
        className="mx-auto w-full px-6 lg:max-w-460 lg:px-30"
      >
        {children}
      </div>
      <Footer CATEGORIES={CATEGORIES} />
    </>
  );
}
