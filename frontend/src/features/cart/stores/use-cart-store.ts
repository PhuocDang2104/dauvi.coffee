"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect } from "react";

import { persistedCartStateSchema } from "../domain/cart.schema";
import type { AddCartItemInput, CartItem } from "../domain/cart.types";
import { createCartItemId } from "../domain/cart.utils";

export const CART_STORAGE_KEY = "vtc-cart-v1";
export const CART_STORAGE_VERSION = 1;

let hydrationStarted = false;

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  hasHydrated: boolean;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

function clampQuantity(quantity: number): number {
  return Math.min(99, Math.max(1, Math.trunc(quantity)));
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,
      hasHydrated: false,
      addItem: (input) =>
        set((state) => {
          const id = createCartItemId(input);
          const existingItem = state.items.find((item) => item.id === id);
          const quantity = clampQuantity(input.quantity ?? 1);

          if (existingItem) {
            return {
              isDrawerOpen: true,
              items: state.items.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      quantity: clampQuantity(item.quantity + quantity),
                    }
                  : item,
              ),
            };
          }

          return {
            isDrawerOpen: true,
            items: [...state.items, { ...input, id, quantity }],
          };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== itemId)
              : state.items.map((item) =>
                  item.id === itemId
                    ? { ...item, quantity: clampQuantity(quantity) }
                    : item,
                ),
        })),
      clearCart: () => set({ items: [], isDrawerOpen: false }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () =>
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: CART_STORAGE_KEY,
      version: CART_STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      // Hydrate after React mounts so persisted items cannot cause a server/client
      // markup mismatch on the cart counter, drawer, cart page or checkout.
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      migrate: (persistedState) => {
        const parsedState = persistedCartStateSchema.safeParse(persistedState);
        return { items: parsedState.success ? parsedState.data.items : [] };
      },
      merge: (persistedState, currentState) => {
        const parsedState = persistedCartStateSchema.safeParse(persistedState);

        return {
          ...currentState,
          items: parsedState.success ? parsedState.data.items : [],
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function useCartHydrated(): boolean {
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  useEffect(() => {
    if (useCartStore.getState().hasHydrated || hydrationStarted) return;
    hydrationStarted = true;

    void Promise.resolve(useCartStore.persist.rehydrate()).finally(() => {
      useCartStore.getState().setHasHydrated(true);
    });
  }, []);

  return hasHydrated;
}
