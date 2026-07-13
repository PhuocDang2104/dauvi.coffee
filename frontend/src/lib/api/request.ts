import type { z } from "zod";

import { ApiError } from "./api-error";

export type QueryValue = string | number | boolean | readonly (string | number | boolean)[];
export type QueryParameters = Record<string, QueryValue | null | undefined>;

export interface ApiRequestOptions<T> extends Omit<RequestInit, "body"> {
  baseUrl: string;
  body?: unknown;
  query?: QueryParameters;
  schema?: z.ZodType<T>;
}

function buildUrl(baseUrl: string, path: string, query?: QueryParameters): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${normalizedBaseUrl}${normalizedPath}`);

  if (!query) return url.toString();

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === null || rawValue === "") continue;
    const values = Array.isArray(rawValue) ? rawValue : [rawValue];
    for (const value of values) {
      url.searchParams.append(key, String(value));
    }
  }

  return url.toString();
}

async function readResponsePayload(response: Response): Promise<unknown> {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return text;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError("Phản hồi API không phải JSON hợp lệ.", response.status, response.url, text);
  }
}

export async function apiRequest<T>(
  path: string,
  { baseUrl, body, query, schema, headers, ...requestInit }: ApiRequestOptions<T>,
): Promise<T> {
  const url = buildUrl(baseUrl, path, query);
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("content-type")) {
    requestHeaders.set("content-type", "application/json");
  }
  if (!requestHeaders.has("accept")) {
    requestHeaders.set("accept", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...requestInit,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError(
      "Không thể kết nối tới API dữ liệu.",
      0,
      url,
      error instanceof Error ? error.message : error,
    );
  }

  const payload = await readResponsePayload(response);
  if (!response.ok) {
    const responseMessage =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String(payload.message)
        : `API trả về trạng thái ${response.status}.`;
    throw new ApiError(responseMessage, response.status, url, payload);
  }

  return schema ? schema.parse(payload) : (payload as T);
}

