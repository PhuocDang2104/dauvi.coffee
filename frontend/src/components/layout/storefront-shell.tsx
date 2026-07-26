"use client";

import type { ReactNode } from "react";
import { calculateCartQuantity, CartDrawer, MiniCartButton, useCartHydrated, useCartStore } from "@/features/cart";
import { CoffeeChatWidget } from "@/features/chatbot/components/coffee-chat-widget";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function StorefrontShell({ children }: { children: ReactNode }) {
  const items = useCartStore((state) => state.items);
  const hydrated = useCartHydrated();
  const count = hydrated ? calculateCartQuantity(items) : 0;

  return (
    <>
      <SiteHeader cartCount={count} cartSlot={<MiniCartButton />} />
      {children}
      <SiteFooter />
      <CartDrawer />
      <CoffeeChatWidget />
    </>
  );
}
