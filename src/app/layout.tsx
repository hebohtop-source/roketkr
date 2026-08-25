export const dynamic = "force-dynamic";

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/providers";
import { Noto_Sans, Playfair_Display, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
import { Manrope, Merriweather, Open_Sans, Roboto } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/shared/hero";
import Script from "next/script";
import { AdminBar } from "@/components/admin/AdminBar";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-manrope",
});
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-merriweather",
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-open-sans",
});

const roboto = Roboto({
  weight: ["300"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoketKRD — рестайлинг под ключ",
  description:
    "RoketKRD — продажа, установка и оформление комплектов рестайлинга и автозапчастей в Краснодаре.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${merriweather.variable} ${openSans.variable} ${roboto.className}`}
    >
      <body className="min-h-screen bg-[#f4f5f7] antialiased">
        <Providers>
          <AdminBar />
          {children}
        </Providers>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src="https://analytics.roketkrd.com/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
