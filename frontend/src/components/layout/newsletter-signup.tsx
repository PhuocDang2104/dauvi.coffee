"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  const inputId = useId();
  const noteId = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex min-h-14 items-center gap-3 rounded-2xl border border-[var(--forest-600,#3f6b52)]/20 bg-white/65 px-5 py-3 text-[var(--forest-950,#102a20)]"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--forest-600,#3f6b52)]/10">
          <Check aria-hidden="true" className="size-4" />
        </span>
        <p className="text-sm leading-6">
          Đã ghi nhận trong phiên demo. Hệ thống gửi bản tin sẽ được kết nối ở
          giai đoạn backend.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-describedby={noteId} className="w-full">
      <label htmlFor={inputId} className="sr-only">
        Email nhận Field Notes
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Email của bạn"
          className="bg-white/85"
        />
        <Button type="submit" className="shrink-0">
          Đăng ký
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
      <p
        id={noteId}
        className="mt-2 text-xs leading-5 text-[var(--ink-500,#6c716c)]"
      >
        Bản demo không gửi email và không lưu địa chỉ lên máy chủ.
      </p>
    </form>
  );
}
