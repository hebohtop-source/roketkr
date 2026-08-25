"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SuccessModal({ orderNumber, onClose }: { orderNumber: string; onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-lg mx-4 space-y-4 shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-xl border border-zinc-300 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-3xl font-bold text-zinc-900">Спасибо за заказ!</h2>
        <p className="text-zinc-700 leading-relaxed">
          Ваш заказ № {orderNumber} успешно оформлен.<br />
          Подробная информация отправлена на вашу почту.<br />
          Менеджер свяжется с вами в течение 10–20 минут.
        </p>
        <Button onClick={() => router.push("/")} className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 font-semibold text-base">
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
}
