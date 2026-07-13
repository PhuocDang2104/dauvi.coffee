import Image from "next/image";
import type { Product } from "@/features/products/domain/product.types";
import { cn } from "@/lib/utils";

interface ProductPackProps {
  product: Product;
  weightLabel?: string;
  className?: string;
  priority?: boolean;
}

export function ProductPack({ product, weightLabel = "250 g", className, priority = false }: ProductPackProps) {
  return (
    <figure
      className={cn(
        "product-visual relative aspect-square w-full overflow-hidden rounded-[1.4rem]",
        className,
      )}
      role="img"
      aria-label={`Gói cà phê DẤU VỊ ${product.displayName}, ${product.regionLabel}, ${weightLabel}`}
    >
      <Image
        src={product.image.src}
        alt={product.image.alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 86vw, (max-width: 1024px) 46vw, 34vw"
        className="object-contain"
      />
    </figure>
  );
}
