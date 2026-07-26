import type { z } from "zod";

import type { checkoutSchema, orderResponseSchema } from "./checkout.schema";

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;

export interface DemoOrderConfirmation {
  recipientName: string;
  itemCount: number;
  total: number;
  orderCode?: string;
  persistedOnServer: boolean;
}
