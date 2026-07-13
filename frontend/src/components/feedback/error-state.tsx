"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button, buttonClassNames } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  reset?: () => void;
  homeHref?: string;
  className?: string;
}

export function ErrorState({
  title = "Có điều gì đó chưa đi đúng hành trình",
  description = "Không thể tải nội dung lúc này. Bạn có thể thử lại hoặc quay về trang chủ.",
  reset,
  homeHref = "/",
  className,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={cn(
        "mx-auto flex min-h-[26rem] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <span className="mb-5 grid size-14 place-items-center rounded-full bg-[#a4463d]/10 text-[#8b3932]">
        <AlertTriangle
          aria-hidden="true"
          className="size-6"
          strokeWidth={1.7}
        />
      </span>
      <h1 className="font-display text-4xl leading-tight text-[var(--ink-950,#181a18)]">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-[var(--ink-700,#454944)]">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {reset ? (
          <Button onClick={reset}>
            <RotateCcw aria-hidden="true" className="size-4" />
            Thử lại
          </Button>
        ) : null}
        <Link
          href={homeHref}
          className={buttonClassNames({ variant: "outline" })}
        >
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
