export function normalizeLotCode(value: string): string {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

