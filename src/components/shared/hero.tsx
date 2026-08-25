"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BottomNavBar } from "./BottomNav";
import { TopNavBar } from "./top-nav";
import heroImage from "../../components/header-image.png";

export const Hero = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 right-0 left-0 z-50 pb-2 transition-colors duration-300 sm:pb-6 ${
          scrolled ? "bg-gray-900" : "bg-transparent"
        }`}
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 1rem)",
        }}
      >
        <TopNavBar />
      </div>
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <Image
          src={heroImage}
          alt=""
          className="h-auto w-full"
          sizes="100vw"
          priority
        />
      </section>

      <BottomNavBar />
    </>
  );
};
