import { ProductCardSkeleton } from "./product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export interface PageSkeletonProps {
  variant?: "page" | "shop" | "product";
}

export function PageSkeleton({ variant = "page" }: PageSkeletonProps) {
  if (variant === "shop") {
    return (
      <div
        className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-16"
        role="status"
        aria-label="Đang tải bộ sưu tập"
      >
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-5 h-12 w-full max-w-xl" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "product") {
    return (
      <div
        className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-12 lg:px-16"
        role="status"
        aria-label="Đang tải sản phẩm"
      >
        <Skeleton className="aspect-[4/5] w-full rounded-[1.75rem] lg:col-span-7" />
        <div className="space-y-5 lg:col-span-5 lg:pt-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-16"
      role="status"
      aria-label="Đang tải nội dung"
    >
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-5 h-14 w-full max-w-2xl" />
      <Skeleton className="mt-6 h-5 w-full max-w-xl" />
      <Skeleton className="mt-3 h-5 w-full max-w-lg" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
