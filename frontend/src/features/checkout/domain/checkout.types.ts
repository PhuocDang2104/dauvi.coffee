import type { z } from "zod";

import type { checkoutSchema } from "./checkout.schema";

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export interface DemoOrderConfirmation {
  recipientName: string;
  itemCount: number;
  total: number;
}

