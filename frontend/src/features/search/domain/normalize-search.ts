/**
 * Normalizes user-facing Vietnamese text for forgiving catalog and lot searches.
 * `đ` requires an explicit replacement because Unicode NFD does not decompose it.
 */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLocaleLowerCase("vi-VN")
    .trim()
    .replace(/\s+/g, " ");
}

export function includesNormalized(haystack: string, needle: string): boolean {
  const normalizedNeedle = normalizeSearch(needle);

  if (!normalizedNeedle) {
    return true;
  }

  return normalizeSearch(haystack).includes(normalizedNeedle);
}

