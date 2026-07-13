"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/features/products/domain/product.types";
import { getDefaultGrind, getDefaultVariant } from "@/features/products/domain/product.utils";
import { useCartStore } from "@/features/cart";

export function QuickAddButton({ product, className = "button-primary" }: { product: Product; className?: string }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const variant = getDefaultVariant(product);

  if (!variant) return null;

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
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
          grind: variant.format === "drip-bag" ? undefined : getDefaultGrind(variant),
          unitPrice: variant.price.amount,
          currency: "VND",
          image: product.image,
          accent: product.accent,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1000);
      }}
    >
      {added ? <Check aria-hidden="true" size={16} /> : <Plus aria-hidden="true" size={16} />} {added ? "Đã thêm" : "Thêm vào giỏ"}
    </button>
  );
}
