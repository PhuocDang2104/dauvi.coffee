"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { ArrowRight, Eye, X } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";
import { getStartingPrice } from "@/features/products/domain/product.utils";
import { formatCurrency } from "@/lib/format/currency";
import { ProductPack } from "./product-pack";
import { QuickAddButton } from "./quick-add-button";

export function ProductQuickView({ product }: { product: Product }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="absolute bottom-4 left-1/2 z-20 hidden min-h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-mist-50 px-4 text-xs font-extrabold text-forest-950 opacity-0 shadow-soft transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 md:flex">
        <Eye aria-hidden="true" size={15} /> Xem nhanh
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-forest-950/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[1.7rem] bg-mist-50 p-5 shadow-2xl md:p-8">
          <Dialog.Close className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-basalt-900/10 bg-white" aria-label="Đóng xem nhanh"><X aria-hidden="true" size={19} /></Dialog.Close>
          <div className="grid gap-8 md:grid-cols-[.78fr_1.22fr] md:items-center">
            <div className="topo-surface flex min-h-[22rem] items-center justify-center rounded-[1.4rem] bg-paper-100 p-8"><ProductPack product={product} className="w-[62%]" /></div>
            <div>
              <p className="eyebrow">{product.regionLabel} · {product.process}</p>
              <Dialog.Title className="mt-3 font-display text-4xl font-semibold leading-tight tracking-[-0.045em]">{product.displayName}</Dialog.Title>
              <Dialog.Description className="mt-4 leading-7 text-ink-700">{product.proposition}</Dialog.Description>
              <div className="mt-5 flex flex-wrap gap-2">{product.flavor.notes.slice(0, 4).map((note) => <span key={note} className="rounded-full bg-paper-100 px-3 py-1.5 text-xs font-bold text-roast-700">{note}</span>)}</div>
              <p className="mt-6 text-sm text-ink-500">Giá từ <strong className="ml-1 text-xl text-forest-950">{formatCurrency(getStartingPrice(product))}</strong></p>
              <div className="mt-7 flex flex-wrap gap-3"><QuickAddButton product={product} /><Dialog.Close asChild><Link href={`/shop/${product.slug}`} className="button-secondary">Chọn quy cách <ArrowRight aria-hidden="true" size={16} /></Link></Dialog.Close></div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
