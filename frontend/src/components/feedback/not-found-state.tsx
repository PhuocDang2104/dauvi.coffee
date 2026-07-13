import Link from "next/link";
import { MapPinned } from "lucide-react";

import { buttonClassNames } from "@/components/ui/button";

export interface NotFoundStateProps {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
}

export function NotFoundState({
  title = "Không tìm thấy điểm đến này",
  description = "Đường dẫn có thể đã thay đổi. Hãy trở lại bộ sưu tập để tiếp tục hành trình.",
  primaryHref = "/shop",
  primaryLabel = "Khám phá bộ sưu tập",
}: NotFoundStateProps) {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-mono text-sm font-bold tracking-[0.24em] text-[var(--clay-500,#b86f45)]">
        404 · ROUTE NOT FOUND
      </p>
      <MapPinned
        aria-hidden="true"
        className="my-7 size-14 text-[var(--forest-800,#214536)]"
        strokeWidth={1.35}
      />
      <h1 className="font-display text-4xl leading-tight text-[var(--ink-950,#181a18)] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-[var(--ink-700,#454944)]">
        {description}
      </p>
      <Link
        href={primaryHref}
        className={buttonClassNames({ className: "mt-8" })}
      >
        {primaryLabel}
      </Link>
    </main>
  );
}
