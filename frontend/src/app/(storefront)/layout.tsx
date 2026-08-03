import type { ReactNode } from "react";

// Storefront pages use the backend repository in production. Keep deployment
// builds independent from API/DNS availability and load data at request time.
export const dynamic = "force-dynamic";

export default function StorefrontLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
