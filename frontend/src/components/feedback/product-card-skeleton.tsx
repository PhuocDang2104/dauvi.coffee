import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/components/ui/utils";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-[var(--sand-200,#e5d8c5)] bg-white p-3",
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton className="aspect-[4/5] w-full rounded-[1.15rem]" />
      <div className="space-y-3 px-2 pb-3 pt-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
        <div className="flex items-center justify-between pt-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="size-11 rounded-full" />
        </div>
      </div>
    </div>
  );
}
