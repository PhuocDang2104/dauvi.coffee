import type { Product } from "./product.types";
import { productArraySchema, productListResponseSchema, productSchema } from "./product.schema";

export function mapProductDto(input: unknown): Product {
  return productSchema.parse(input);
}

export function mapProductDtos(input: unknown): Product[] {
  return productArraySchema.parse(input);
}

export function mapProductListResponse(input: unknown): Product[] {
  const parsed = productListResponseSchema.parse(input);
  return Array.isArray(parsed) ? parsed : parsed.data;
}

