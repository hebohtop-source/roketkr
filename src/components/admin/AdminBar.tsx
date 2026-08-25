"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth/client";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function AdminBar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--admin-bar-height",
      session?.user ? "30px" : "0px",
    );
  }, [session]);

  if (isPending || !session?.user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-[9999] flex items-center justify-between bg-black px-4 py-1.5 text-sm text-white">
      <Link
        href="/admin"
        className="flex items-center gap-1.5 transition-colors hover:text-gray-300"
      >
        <LayoutDashboard size={14} />
        Админ панель
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="flex h-auto items-center gap-1.5 py-0 text-white hover:cursor-pointer hover:bg-transparent hover:text-gray-300"
      >
        <LogOut size={14} />
        Выйти
      </Button>
    </div>
  );
}
