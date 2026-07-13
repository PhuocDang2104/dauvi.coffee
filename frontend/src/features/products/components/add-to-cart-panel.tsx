"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { GrindType, Product, ProductFormat, ProductVariant } from "@/features/products/domain/product.types";
import { getDefaultGrind, getDefaultVariant } from "@/features/products/domain/product.utils";
import { formatCurrency } from "@/lib/format/currency";
import { useCartStore } from "@/features/cart";

const formatLabels: Record<ProductFormat, string> = {
  "whole-bean": "Hạt rang",
  ground: "Cà phê xay",
  "drip-bag": "Drip bag",
};

const grindLabels: Record<GrindType, string> = {
  "whole-bean": "Nguyên hạt",
  phin: "Phin",
  espresso: "Espresso",
  "pour-over": "Pour-over",
  "french-press": "French press",
  "moka-pot": "Moka pot",
};

function variantLabel(variant: ProductVariant) {
  if (variant.format === "drip-bag") return `${variant.dripBagCount} gói × ${variant.dripBagWeightGrams} g`;
  return `${variant.weightGrams} g`;
}

export function AddToCartPanel({ product }: { product: Product }) {
  const initialVariant = getDefaultVariant(product) ?? product.variants[0];
  const [variantId, setVariantId] = useState(initialVariant.id);
  const [grind, setGrind] = useState<GrindType | undefined>(() => getDefaultGrind(initialVariant));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const variant = product.variants.find((item) => item.id === variantId) ?? initialVariant;

  const formats = useMemo(() => [...new Set(product.variants.filter((item) => item.inStock).map((item) => item.format))], [product.variants]);
  const variantsForFormat = product.variants.filter((item) => item.inStock && item.format === variant.format);

  const chooseVariant = (nextVariant: ProductVariant) => {
    setVariantId(nextVariant.id);
    setGrind(getDefaultGrind(nextVariant));
  };

  const chooseFormat = (format: ProductFormat) => {
    const nextVariant =
      product.variants.find((item) => item.inStock && item.format === format && item.weightGrams === 250) ??
      product.variants.find((item) => item.inStock && item.format === format);
    if (nextVariant) chooseVariant(nextVariant);
  };

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.displayName,
      productShortName: product.shortName,
      variantId: variant.id,
      sku: variant.sku,
      format: variant.format,
      weightGrams: variant.weightGrams,
      dripBagCount: variant.dripBagCount,
      dripBagWeightGrams: variant.dripBagWeightGrams,
      grind: variant.format === "ground" ? grind : variant.format === "whole-bean" ? "whole-bean" : undefined,
      unitPrice: variant.price.amount,
      currency: "VND",
      image: product.image,
      accent: product.accent,
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div>
      <div className="space-y-6">
        <fieldset>
          <legend className="text-sm font-extrabold">Định dạng</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {formats.map((format) => (
              <button
                key={format}
                type="button"
                role="radio"
                aria-checked={variant.format === format}
                onClick={() => chooseFormat(format)}
                className={`min-h-12 rounded-xl border px-3 text-sm font-bold ${variant.format === format ? "border-forest-950 bg-forest-950 text-white" : "border-basalt-900/15 bg-white text-ink-700"}`}
              >
                {formatLabels[format]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-extrabold">Quy cách</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {variantsForFormat.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={item.id === variant.id}
                onClick={() => chooseVariant(item)}
                className={`min-h-12 min-w-24 rounded-xl border px-4 text-sm font-bold ${item.id === variant.id ? "border-forest-950 bg-paper-100 text-forest-950" : "border-basalt-900/15 bg-white text-ink-700"}`}
              >
                {variantLabel(item)}
              </button>
            ))}
          </div>
        </fieldset>

        {variant.format === "ground" ? (
          <fieldset>
            <legend className="text-sm font-extrabold">Xay theo dụng cụ</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {variant.grindOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={grind === option}
                  onClick={() => setGrind(option)}
                  className={`min-h-12 rounded-xl border px-3 text-sm font-bold ${grind === option ? "border-clay-500 bg-clay-500/10 text-roast-700" : "border-basalt-900/15 bg-white text-ink-700"}`}
                >
                  {grindLabels[option]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs leading-5 text-ink-500">Cà phê chỉ được xay sau khi bạn chọn dụng cụ pha.</p>
          </fieldset>
        ) : null}

        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Giá lựa chọn</p>
            <p className="mt-1 text-2xl font-extrabold text-forest-950" data-testid="selected-price">{formatCurrency(variant.price.amount)}</p>
          </div>
          <div>
            <p className="mb-2 text-right text-xs font-bold text-ink-500">Số lượng</p>
            <div className="flex items-center rounded-full border border-basalt-900/15 bg-white">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex size-11 items-center justify-center rounded-full" aria-label="Giảm số lượng"><Minus aria-hidden="true" size={16} /></button>
              <output className="w-8 text-center text-sm font-bold" aria-live="polite">{quantity}</output>
              <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="flex size-11 items-center justify-center rounded-full" aria-label="Tăng số lượng"><Plus aria-hidden="true" size={16} /></button>
            </div>
          </div>
        </div>

        <button type="button" onClick={handleAdd} disabled={!variant.inStock} className="button-primary w-full !min-h-14" data-testid="add-to-cart">
          {added ? <><Check aria-hidden="true" size={18} /> Đã thêm</> : <><ShoppingBag aria-hidden="true" size={18} /> Thêm vào giỏ · {formatCurrency(variant.price.amount * quantity)}</>}
        </button>
        <p className="text-center text-xs leading-5 text-ink-500">Miễn phí giao nội thành cho đơn từ 499.000 ₫ · Giỏ hàng lưu trên thiết bị</p>
      </div>

      <div className="fixed inset-x-0 bottom-[4.65rem] z-30 border-t border-basalt-900/10 bg-mist-50/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-ink-700">{variantLabel(variant)}</p><p className="text-sm font-extrabold text-forest-950">{formatCurrency(variant.price.amount * quantity)}</p></div>
          <button type="button" onClick={handleAdd} className="button-primary shrink-0" aria-label={`Thêm ${product.shortName} vào giỏ`}>
            {added ? <Check aria-hidden="true" size={18} /> : <ShoppingBag aria-hidden="true" size={18} />} {added ? "Đã thêm" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
}
