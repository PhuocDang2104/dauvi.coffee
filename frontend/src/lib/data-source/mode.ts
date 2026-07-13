import { z } from "zod";

const dataSourceModeSchema = z.enum(["mock", "http"]);
export type DataSourceMode = z.infer<typeof dataSourceModeSchema>;

export function getDataSourceMode(
  value = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock",
): DataSourceMode {
  const parsed = dataSourceModeSchema.safeParse(value);
  if (!parsed.success) {
    throw new Error(
      `NEXT_PUBLIC_DATA_SOURCE must be "mock" or "http"; received "${value}".`,
    );
  }
  return parsed.data;
}

