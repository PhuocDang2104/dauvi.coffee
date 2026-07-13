"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { formatVnd } from "@/features/cart/domain/cart.utils";
import { useCartStore } from "@/features/cart/stores/use-cart-store";
import type {
  GrindType,
  ProductVariant,
} from "@/features/products/domain/product.types";
import type {
  AdvisorPreferences,
  ProductRecommendation,
} from "../domain/advisor.types";
import { RecommendationReasons } from "./recommendation-reasons";

interface RecommendationCardProps {
  recommendation: ProductRecommendation;
  preferences: AdvisorPreferences;
  rank: number;
}

const RANK_LABELS = [
  "Phù hợp nhất",
  "Lựa chọn thay thế",
  "Một hướng vị khác",
] as const;

function grindForBrewMethod(
  brewMethod: AdvisorPreferences["brewMethod"],
): GrindType {
  switch (brewMethod) {
    case "phin":
      return "phin";
    case "espresso":
      return "espresso";
    case "french-press":
    case "cold-brew":
      return "french-press";
    case "moka-pot":
      return "moka-pot";
    case "pour-over":
    case "aeropress":
    case "drip":
      return "pour-over";
  }
}

function selectRecommendationVariant(
  recommendation: ProductRecommendation,
  preferences: AdvisorPreferences,
): ProductVariant | undefined {
  return recommendation.product.variants
    .filter(
      (variant) => variant.inStock && variant.format === preferences.format,
    )
    .sort((left, right) => left.price.amount - right.price.amount)[0];
}

export function RecommendationCard({
  recommendation,
  preferences,
  rank,
}: RecommendationCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { product } = recommendation;
  const variant = useMemo(
    () => selectRecommendationVariant(recommendation, preferences),
    [preferences, recommendation],
  );
  const grind =
    variant?.format === "ground"
      ? (() => {
          const preferredGrind = grindForBrewMethod(preferences.brewMethod);
          return variant.grindOptions.includes(preferredGrind)
            ? preferredGrind
            : variant.grindOptions[0];
        })()
      : variant?.format === "whole-bean"
        ? "whole-bean"
        : undefined;

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1_200);
    return () => window.clearTimeout(timeout);
  }, [added]);

  const addRecommendation = () => {
    if (!variant) return;

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
      grind,
      unitPrice: variant.price.amount,
      currency: variant.price.currency,
      image: product.image,
      accent: product.accent,
      quantity: 1,
    });
    setAdded(true);
  };

  return (
    <article
      className={`relative overflow-hidden rounded-[1.75rem] border bg-white p-5 sm:p-6 ${
        rank === 1
          ? "border-[color:var(--forest-800)] shadow-[0_16px_40px_rgba(24,26,24,0.08)]"
          : "border-[color:var(--sand-200)]"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full border border-current opacity-[0.08]"
        style={{ color: product.accent }}
        aria-hidden="true"
      >
        <span className="absolute inset-5 rounded-full border border-current" />
        <span className="absolute inset-10 rounded-full border border-current" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--forest-600)]">
            {RANK_LABELS[rank - 1] ?? `Gợi ý ${rank}`}
          </p>
          <h3 className="mt-2 max-w-[18rem] font-display text-2xl leading-tight text-[var(--ink-950)]">
            {product.displayName}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-700)]">
            {product.regionLabel} · {product.process} · {product.roastLevel}
          </p>
        </div>
        <div
          className="relative inline-flex size-16 shrink-0 items-center justify-center rounded-full border-4 border-[var(--paper-100)] bg-[var(--forest-950)] text-center text-white"
          aria-label={`Điểm phù hợp ${recommendation.score} trên 100`}
        >
          <span className="font-mono text-lg font-bold tabular-nums">
            {recommendation.score}
          </span>
          <span className="sr-only"> trên 100</span>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        {product.flavor.notes.slice(0, 3).map((note) => (
          <span
            key={note}
            className="rounded-full border border-[color:var(--sand-200)] bg-[var(--mist-50)] px-3 py-1 text-xs text-[var(--ink-700)]"
          >
            {note}
          </span>
        ))}
      </div>

      <div className="relative mt-6 border-t border-[color:var(--sand-200)] pt-5">
        <RecommendationReasons reasons={recommendation.reasons} />
      </div>

      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--sand-200)] pt-5">
        <div>
          <span className="block text-xs text-[var(--ink-500)]">Giá từ</span>
          <strong className="mt-0.5 block text-lg tabular-nums">
            {variant ? formatVnd(variant.price.amount) : "Chưa có quy cách"}
          </strong>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-full border border-[color:var(--forest-950)] px-4 text-sm font-semibold text-[var(--forest-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
          >
            Xem sản phẩm
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={addRecommendation}
            disabled={!variant}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--forest-950)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--forest-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {added ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <ShoppingBag className="size-4" aria-hidden="true" />
            )}
            {added ? "Đã thêm" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </article>
  );
}
