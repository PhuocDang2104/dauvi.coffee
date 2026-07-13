import { BRAND_CONFIG } from "@/config/brand";
import { absoluteUrl } from "@/config/site";

import { JsonLd } from "./json-ld";

export interface ProductJsonLdVariant {
  id: string;
  sku: string;
  price: {
    amount: number;
    currency: "VND";
  };
  inStock: boolean;
}

export interface ProductJsonLdData {
  id: string;
  slug: string;
  displayName: string;
  story: string;
  regionLabel: string;
  process: string;
  roastLevel: string;
  image?: {
    src: string;
    alt?: string;
  };
  flavor?: {
    notes: string[];
  };
  variants: ProductJsonLdVariant[];
}

export interface ProductJsonLdProps {
  product: ProductJsonLdData;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const productUrl = absoluteUrl(`/shop/${product.slug}`);
  const notes = product.flavor?.notes.slice(0, 3).join(", ");
  const description = notes
    ? `${product.regionLabel} · ${product.process} · ${product.roastLevel}. Hương vị: ${notes}.`
    : product.story;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.displayName,
        description,
        image: product.image ? [absoluteUrl(product.image.src)] : undefined,
        sku: product.id,
        category: "Cà phê rang đóng gói",
        brand: {
          "@type": "Brand",
          name: BRAND_CONFIG.name,
        },
        offers: product.variants.map((variant) => ({
          "@type": "Offer",
          "@id": `${productUrl}#${variant.id}`,
          url: productUrl,
          sku: variant.sku,
          price: variant.price.amount.toString(),
          priceCurrency: variant.price.currency,
          availability: variant.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@id": absoluteUrl("/#organization"),
          },
        })),
      }}
    />
  );
}
