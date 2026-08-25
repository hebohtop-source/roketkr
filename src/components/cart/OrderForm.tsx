"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  total: string;
  submitting: boolean;
  error: string | null;
  disabled: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function OrderForm({
  total,
  submitting,
  error,
  disabled,
  onSubmit,
}: Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 space-y-4 rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-3xl font-bold text-zinc-900">Оформить заказ</h2>
      <div className="space-y-3">
        <Input
          name="name"
          placeholder="Ваше имя*"
          required
          className="rounded-xl border-zinc-200"
        />
        <Input
          name="phone"
          placeholder="Ваш телефон*"
          type="tel"
          required
          className="rounded-xl border-zinc-200"
        />
        <Input
          name="email"
          placeholder="Ваш e-mail*"
          type="email"
          className="rounded-xl border-zinc-200"
        />
        <Input
          name="city"
          placeholder="Ваш город"
          className="rounded-xl border-zinc-200"
        />
        <Textarea
          name="comment"
          placeholder="Комментарий"
          className="resize-none rounded-xl border-zinc-200"
          rows={3}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-zinc-700">Итого</span>
        <span className="text-base font-bold text-zinc-900">{total}</span>
      </div>

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-500">
        <Checkbox
          checked={agreed}
          onCheckedChange={(v) => setAgreed(v === true)}
          className="mt-0.5"
        />
        <span>
          Я прочитал(а) и согласен(на) с{" "}
          <Link
            href="/privacy"
            target="_blank"
            className="underline hover:text-zinc-700"
          >
            политикой обработки персональных данных
          </Link>{" "}
          и даю согласие на обработку моих персональных данных
        </span>
      </label>

      <Button
        type="submit"
        disabled={submitting || disabled || !agreed}
        className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Оформление..." : "Заказать"}
      </Button>
    </form>
  );
}
