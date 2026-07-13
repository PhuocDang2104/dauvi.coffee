"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";

import { SEARCH_SUGGESTIONS } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";

export interface SearchDialogProps {
  className?: string;
  showLabel?: boolean;
  tone?: "dark" | "light";
}

export function SearchDialog({
  className,
  showLabel = false,
  tone = "dark",
}: SearchDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const titleId = useId();
  const inputId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function close() {
    setOpen(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    if (!normalized) {
      inputRef.current?.focus();
      return;
    }

    close();
    router.push(`/shop?q=${encodeURIComponent(normalized)}`);
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)] focus-visible:ring-offset-2",
          tone === "light"
            ? "text-white hover:bg-white/10 focus-visible:ring-offset-[var(--forest-950,#102a20)]"
            : "text-[var(--ink-950,#181a18)] hover:bg-[var(--paper-100,#f3eee4)]",
          className,
        )}
        aria-haspopup="dialog"
      >
        <Search
          aria-hidden="true"
          className="size-[1.1rem]"
          strokeWidth={1.8}
        />
        {showLabel ? (
          <span>Tìm kiếm</span>
        ) : (
          <span className="sr-only">Mở tìm kiếm</span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={closeOnBackdrop}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-black/30 p-0 backdrop:bg-black/30 open:grid open:place-items-start sm:open:place-items-center"
      >
        <div className="relative mt-0 w-full overflow-hidden bg-[var(--mist-50,#faf8f2)] p-6 shadow-2xl sm:mt-0 sm:max-w-2xl sm:rounded-[1.75rem] sm:p-8">
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-[var(--ink-700,#454944)] transition hover:bg-[var(--paper-100,#f3eee4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)] sm:right-5 sm:top-5"
            aria-label="Đóng tìm kiếm"
          >
            <X aria-hidden="true" className="size-5" />
          </button>

          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--clay-500,#b86f45)]">
            Tìm trong bộ sưu tập
          </p>
          <h2
            id={titleId}
            className="mt-3 pr-10 font-display text-3xl leading-tight text-[var(--ink-950,#181a18)] sm:text-4xl"
          >
            Bạn muốn bắt đầu từ vị, vùng hay cách pha?
          </h2>

          <form onSubmit={submit} className="mt-7">
            <label htmlFor={inputId} className="sr-only">
              Từ khóa tìm kiếm sản phẩm
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--ink-500,#6c716c)]"
                />
                <Input
                  ref={inputRef}
                  id={inputId}
                  name="q"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ví dụ: phin, Arabica, Honey…"
                  autoComplete="off"
                  className="pl-12"
                />
              </div>
              <Button type="submit" className="sm:px-6">
                Tìm sản phẩm
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </form>

          <div className="mt-6 border-t border-[var(--sand-200,#e5d8c5)] pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-500,#6c716c)]">
              Gợi ý nhanh
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SEARCH_SUGGESTIONS.map((suggestion) => (
                <Link
                  key={suggestion.query}
                  href={`/shop?q=${encodeURIComponent(suggestion.query)}`}
                  onClick={close}
                  className="inline-flex min-h-11 items-center rounded-full border border-[var(--sand-200,#e5d8c5)] bg-white px-4 text-sm font-semibold text-[var(--ink-700,#454944)] transition hover:border-[var(--forest-600,#3f6b52)] hover:text-[var(--forest-950,#102a20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clay-500,#b86f45)]"
                >
                  {suggestion.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
