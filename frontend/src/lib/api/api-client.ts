import type { z } from "zod";

import { apiRequest, type QueryParameters } from "./request";

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
}

interface ClientRequestOptions<T> extends Omit<RequestInit, "body" | "method"> {
  query?: QueryParameters;
  schema?: z.ZodType<T>;
}

interface ClientMutationOptions<T> extends ClientRequestOptions<T> {
  body?: unknown;
}

export class ApiClient {
  constructor(private readonly baseUrl = getApiBaseUrl()) {}

  get<T>(path: string, options: ClientRequestOptions<T> = {}): Promise<T> {
    return apiRequest<T>(path, {
      ...options,
      baseUrl: this.baseUrl,
      cache: options.cache ?? "no-store",
      method: "GET",
    });
  }

  post<T>(path: string, options: ClientMutationOptions<T> = {}): Promise<T> {
    return apiRequest<T>(path, {
      ...options,
      baseUrl: this.baseUrl,
      method: "POST",
      body: options.body,
    });
  }

  patch<T>(path: string, options: ClientMutationOptions<T> = {}): Promise<T> {
    return apiRequest<T>(path, {
      ...options,
      baseUrl: this.baseUrl,
      method: "PATCH",
      body: options.body,
    });
  }

  delete<T>(path: string, options: ClientRequestOptions<T> = {}): Promise<T> {
    return apiRequest<T>(path, {
      ...options,
      baseUrl: this.baseUrl,
      method: "DELETE",
    });
  }
}
