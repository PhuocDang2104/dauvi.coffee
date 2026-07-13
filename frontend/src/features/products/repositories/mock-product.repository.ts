import { productArraySchema } from "../domain/product.schema";
import type { Product, ProductFilters } from "../domain/product.types";
import { filterProducts } from "../domain/product.utils";
import { mockProducts } from "@/mocks/data/products";

import type { ProductRepository } from "./product.repository";

export class MockProductRepository implements ProductRepository {
  private readonly products: Product[];

  constructor(products: Product[] = mockProducts) {
    this.products = productArraySchema.parse(products);
  }

  async list(filters: ProductFilters = {}): Promise<Product[]> {
    return filterProducts(this.products, filters);
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return this.products.find((product) => product.published && product.slug === slug) ?? null;
  }

  async getFeatured(): Promise<Product[]> {
    return this.products.filter((product) => product.published);
  }
}

