import { productArraySchema, productSchema } from "../domain/product.schema";
import type { Product, ProductFilters } from "../domain/product.types";
import { ApiClient } from "@/lib/api/api-client";
import { isNotFoundApiError } from "@/lib/api/api-error";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { QueryParameters } from "@/lib/api/request";

import type { ProductRepository } from "./product.repository";

function unwrapData(input: unknown): unknown {
  if (typeof input === "object" && input !== null && "data" in input) {
    return input.data;
  }
  return input;
}

function toQuery(filters: ProductFilters): QueryParameters {
  return {
    q: filters.q,
    species: filters.species,
    region: filters.region,
    process: filters.process,
    roast: filters.roast,
    brew: filters.brew,
    price: filters.price,
    format: filters.format,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort,
  };
}

export class HttpProductRepository implements ProductRepository {
  constructor(private readonly client = new ApiClient()) {}

  async list(filters: ProductFilters = {}): Promise<Product[]> {
    const payload = await this.client.get<unknown>(API_ENDPOINTS.products.list, {
      query: toQuery(filters),
    });
    return productArraySchema.parse(unwrapData(payload));
  }

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const payload = await this.client.get<unknown>(API_ENDPOINTS.products.detail(slug));
      return productSchema.parse(unwrapData(payload));
    } catch (error) {
      if (isNotFoundApiError(error)) return null;
      throw error;
    }
  }

  async getFeatured(): Promise<Product[]> {
    const payload = await this.client.get<unknown>(API_ENDPOINTS.products.featured);
    return productArraySchema.parse(unwrapData(payload));
  }
}

