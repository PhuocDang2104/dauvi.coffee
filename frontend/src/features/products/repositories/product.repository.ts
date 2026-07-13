import type { Product, ProductFilters } from "../domain/product.types";

export interface ProductRepository {
  list(filters?: ProductFilters): Promise<Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
  getFeatured(): Promise<Product[]>;
}

