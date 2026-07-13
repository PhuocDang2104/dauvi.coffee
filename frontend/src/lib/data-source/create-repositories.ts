import { HttpAdvisorRepository } from "@/features/advisor/repositories/http-advisor.repository";
import { MockAdvisorRepository } from "@/features/advisor/repositories/mock-advisor.repository";
import type { AdvisorRepository } from "@/features/advisor/repositories/advisor.repository";
import { HttpProductRepository } from "@/features/products/repositories/http-product.repository";
import { MockProductRepository } from "@/features/products/repositories/mock-product.repository";
import type { ProductRepository } from "@/features/products/repositories/product.repository";
import { HttpTraceabilityRepository } from "@/features/traceability/repositories/http-traceability.repository";
import { MockTraceabilityRepository } from "@/features/traceability/repositories/mock-traceability.repository";
import type { TraceabilityRepository } from "@/features/traceability/repositories/traceability.repository";
import { ApiClient } from "@/lib/api/api-client";

import { getDataSourceMode, type DataSourceMode } from "./mode";

export interface Repositories {
  products: ProductRepository;
  traceability: TraceabilityRepository;
  advisor: AdvisorRepository;
}

export function createRepositories(mode: DataSourceMode = getDataSourceMode()): Repositories {
  if (mode === "http") {
    const client = new ApiClient();
    const products = new HttpProductRepository(client);
    return {
      products,
      traceability: new HttpTraceabilityRepository(client),
      advisor: new HttpAdvisorRepository(client, products),
    };
  }

  const products = new MockProductRepository();
  return {
    products,
    traceability: new MockTraceabilityRepository(),
    advisor: new MockAdvisorRepository(products),
  };
}

let repositoryCache: Repositories | undefined;

export function getRepositories(): Repositories {
  repositoryCache ??= createRepositories();
  return repositoryCache;
}

/** Intended for isolated tests that switch NEXT_PUBLIC_DATA_SOURCE. */
export function resetRepositoryCache(): void {
  repositoryCache = undefined;
}

