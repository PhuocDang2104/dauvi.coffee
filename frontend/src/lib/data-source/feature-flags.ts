function parsePublicBoolean(
  name: string,
  value: string | undefined,
  fallback: boolean,
): boolean {
  if (value === undefined || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be "true" or "false"; received "${value}".`);
}

export function isServerCheckoutEnabled(
  value = process.env.NEXT_PUBLIC_ENABLE_CHECKOUT,
): boolean {
  return parsePublicBoolean("NEXT_PUBLIC_ENABLE_CHECKOUT", value, false);
}

export function isAuthEnabled(
  value = process.env.NEXT_PUBLIC_ENABLE_AUTH,
): boolean {
  return parsePublicBoolean("NEXT_PUBLIC_ENABLE_AUTH", value, false);
}

export function isChatbotApiEnabled(
  value = process.env.NEXT_PUBLIC_ENABLE_CHATBOT_API,
): boolean {
  return parsePublicBoolean("NEXT_PUBLIC_ENABLE_CHATBOT_API", value, false);
}
