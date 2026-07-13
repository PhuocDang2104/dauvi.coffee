"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type {
  Product,
  ProductFilters,
  ProductSort,
} from "@/features/products/domain/product.types";
import { filterProducts } from "@/features/products/domain/product.utils";
import { ProductCardGrid } from "./product-card-grid";

type FilterKey = "species" | "region" | "process" | "roast" | "brew" | "price" | "format";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroup {
  key: FilterKey;
  label: string;
  options: FilterOption[];
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    key: "species",
    label: "Dòng cà phê",
    options: [
      { value: "robusta", label: "Robusta" },
      { value: "arabica", label: "Arabica" },
    ],
  },
  {
    key: "region",
    label: "Vùng",
    options: [
      { value: "gia-lai", label: "Gia Lai" },
      { value: "dak-lak", label: "Đắk Lắk" },
      { value: "bao-lam", label: "Bảo Lâm" },
      { value: "da-lat", label: "Đà Lạt" },
      { value: "langbiang", label: "Langbiang" },
    ],
  },
  {
    key: "process",
    label: "Sơ chế",
    options: [
      { value: "natural", label: "Natural" },
      { value: "honey", label: "Honey" },
      { value: "washed", label: "Washed" },
    ],
  },
  {
    key: "roast",
    label: "Mức rang",
    options: [
      { value: "light-medium", label: "Light–medium" },
      { value: "medium", label: "Medium" },
      { value: "medium-dark", label: "Medium–dark" },
    ],
  },
  {
    key: "brew",
    label: "Cách pha",
    options: [
      { value: "phin", label: "Phin" },
      { value: "espresso", label: "Espresso" },
      { value: "pour-over", label: "Pour-over" },
      { value: "aeropress", label: "AeroPress" },
      { value: "french-press", label: "French press" },
      { value: "moka-pot", label: "Moka pot" },
      { value: "cold-brew", label: "Cold brew" },
      { value: "drip", label: "Drip" },
    ],
  },
  {
    key: "price",
    label: "Giá gói 250 g",
    options: [
      { value: "under-120000", label: "Dưới 120.000 ₫" },
      { value: "120000-160000", label: "120.000–160.000 ₫" },
      { value: "over-160000", label: "Trên 160.000 ₫" },
    ],
  },
  {
    key: "format",
    label: "Định dạng",
    options: [
      { value: "whole-bean", label: "Hạt rang" },
      { value: "ground", label: "Cà phê xay" },
      { value: "drip-bag", label: "Drip bag" },
    ],
  },
];

const SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: "featured", label: "Nổi bật" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "roast-asc", label: "Rang nhẹ đến đậm" },
  { value: "robusta-first", label: "Robusta trước" },
  { value: "arabica-first", label: "Arabica trước" },
];

const LABELS = new Map(FILTER_GROUPS.flatMap((group) => group.options.map((option) => [`${group.key}:${option.value}`, option.label])));

function parseList(params: URLSearchParams, key: FilterKey): string[] {
  return params
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function FiltersContent({
  selected,
  onToggle,
  onClear,
}: {
  selected: Record<FilterKey, string[]>;
  onToggle: (key: FilterKey, value: string) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-basalt-900/10 pb-5">
        <p className="font-display text-2xl font-semibold">Lọc bộ sưu tập</p>
        <button type="button" className="min-h-11 text-sm font-bold text-forest-800 underline underline-offset-4" onClick={onClear}>
          Xóa tất cả
        </button>
      </div>
      {FILTER_GROUPS.map((group) => (
        <fieldset key={group.key} className="border-b border-basalt-900/10 py-5 last:border-0">
          <legend className="mb-3 text-sm font-extrabold text-ink-950">{group.label}</legend>
          <div className="space-y-1">
            {group.options.map((option) => {
              const checked = selected[group.key].includes(option.value);
              return (
                <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm text-ink-700 hover:bg-paper-100">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(group.key, option.value)}
                    className="size-4 rounded border-basalt-900/30 accent-forest-950"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

export function ShopCatalog({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const selected = useMemo(
    () =>
      Object.fromEntries(
        FILTER_GROUPS.map((group) => [group.key, parseList(searchParams, group.key)]),
      ) as Record<FilterKey, string[]>,
    [searchParams],
  );

  const setParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const toggleFilter = (key: FilterKey, value: string) => {
    setParams((params) => {
      const values = parseList(params, key);
      const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      params.delete(key);
      if (next.length) params.set(key, next.join(","));
    });
  };

  const clearFilters = () => {
    setSearchValue("");
    setParams((params) => {
      [...FILTER_GROUPS.map((group) => group.key), "q", "sort"].forEach((key) => params.delete(key));
    });
  };

  const filters = useMemo<ProductFilters>(
    () => ({
      q: searchParams.get("q") ?? undefined,
      species: selected.species as ProductFilters["species"],
      region: selected.region,
      process: selected.process as ProductFilters["process"],
      roast: selected.roast as ProductFilters["roast"],
      brew: selected.brew as ProductFilters["brew"],
      price: selected.price as ProductFilters["price"],
      format: selected.format as ProductFilters["format"],
      sort: (searchParams.get("sort") as ProductSort | null) ?? "featured",
    }),
    [searchParams, selected],
  );

  const results = useMemo(() => filterProducts(products, filters), [products, filters]);
  const activeEntries = FILTER_GROUPS.flatMap((group) => selected[group.key].map((value) => ({ key: group.key, value })));

  return (
    <div>
      <form
        className="relative mb-8 max-w-2xl"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setParams((params) => {
            if (searchValue.trim()) params.set("q", searchValue.trim());
            else params.delete("q");
          });
        }}
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" aria-hidden="true" size={19} />
        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="min-h-14 w-full rounded-full border border-basalt-900/15 bg-white/80 pl-12 pr-28 text-base placeholder:text-ink-500"
          placeholder="Tìm theo tên, vùng, hương vị…"
          aria-label="Tìm sản phẩm"
        />
        <button type="submit" className="absolute right-1.5 top-1/2 min-h-11 -translate-y-1/2 rounded-full bg-forest-950 px-5 text-sm font-bold text-white">
          Tìm
        </button>
      </form>

      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-basalt-900/10 bg-white/60 p-2 lg:hidden">
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <button type="button" className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold">
              <SlidersHorizontal aria-hidden="true" size={17} /> Lọc {activeEntries.length ? `(${activeEntries.length})` : ""}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-forest-950/45 backdrop-blur-sm" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-mist-50 p-6 shadow-2xl">
              <Dialog.Title className="sr-only">Bộ lọc sản phẩm</Dialog.Title>
              <Dialog.Description className="sr-only">Chọn một hoặc nhiều tiêu chí để lọc bộ sưu tập.</Dialog.Description>
              <Dialog.Close className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-paper-100" aria-label="Đóng bộ lọc">
                <X aria-hidden="true" size={20} />
              </Dialog.Close>
              <div className="pt-10">
                <FiltersContent selected={selected} onToggle={toggleFilter} onClear={clearFilters} />
                <Dialog.Close className="button-primary sticky bottom-4 mt-5 w-full">Xem {results.length} sản phẩm</Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <span className="text-xs font-semibold text-ink-500">{results.length} kết quả</span>
        <label className="sr-only" htmlFor="mobile-sort">Sắp xếp</label>
        <select
          id="mobile-sort"
          className="min-h-11 max-w-[9.5rem] rounded-xl border-0 bg-transparent px-2 text-sm font-bold"
          value={filters.sort}
          onChange={(event) => setParams((params) => params.set("sort", event.target.value))}
        >
          {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      <div className="grid gap-10 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Bộ lọc sản phẩm">
          <div className="sticky top-32 rounded-[1.35rem] border border-basalt-900/10 bg-white/60 p-5">
            <FiltersContent selected={selected} onToggle={toggleFilter} onClear={clearFilters} />
          </div>
        </aside>

        <section aria-live="polite" aria-label="Kết quả sản phẩm">
          <div className="mb-5 hidden items-center justify-between gap-4 lg:flex">
            <p className="text-sm font-semibold text-ink-700"><strong className="text-ink-950">{results.length}</strong> sản phẩm</p>
            <label className="flex items-center gap-3 text-sm font-semibold" htmlFor="desktop-sort">
              Sắp xếp
              <select
                id="desktop-sort"
                className="min-h-11 rounded-full border border-basalt-900/15 bg-white px-4"
                value={filters.sort}
                onChange={(event) => setParams((params) => params.set("sort", event.target.value))}
              >
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>

          {(activeEntries.length > 0 || filters.q) && (
            <div className="mb-6 flex flex-wrap gap-2" aria-label="Bộ lọc đang dùng">
              {filters.q ? (
                <button type="button" onClick={() => { setSearchValue(""); setParams((params) => params.delete("q")); }} className="flex min-h-10 items-center gap-2 rounded-full bg-forest-950 px-3 text-xs font-bold text-white">
                  “{filters.q}” <X aria-hidden="true" size={14} />
                </button>
              ) : null}
              {activeEntries.map(({ key, value }) => (
                <button key={`${key}-${value}`} type="button" onClick={() => toggleFilter(key, value)} className="flex min-h-10 items-center gap-2 rounded-full border border-forest-800/20 bg-paper-100 px-3 text-xs font-bold text-forest-950">
                  {LABELS.get(`${key}:${value}`) ?? value} <X aria-hidden="true" size={14} />
                </button>
              ))}
            </div>
          )}

          {results.length > 0 ? (
            <ProductCardGrid products={results} />
          ) : (
            <div className="topo-surface rounded-[1.5rem] border border-basalt-900/10 bg-paper-100 p-8 text-center md:p-14">
              <p className="eyebrow">0 kết quả</p>
              <h2 className="card-heading mt-4">Chưa tìm thấy cà phê phù hợp</h2>
              <p className="mx-auto mt-3 max-w-md text-ink-700">Thử bỏ bớt một tiêu chí hoặc để Coffee Advisor chọn giúp bạn.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={clearFilters} className="button-primary">Xóa bộ lọc</button>
                <Link href="/advisor" className="button-secondary">Mở Coffee Advisor</Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
