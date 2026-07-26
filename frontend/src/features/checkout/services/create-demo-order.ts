import type { CartItem } from "@/features/cart/domain/cart.types";
import { ApiClient } from "@/lib/api/api-client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

import { orderResponseSchema } from "../domain/checkout.schema";
import type {
  CheckoutFormValues,
  OrderResponse,
} from "../domain/checkout.types";

export async function createDemoOrder(
  values: CheckoutFormValues,
  items: readonly CartItem[],
  client = new ApiClient(),
  idempotencyKey = crypto.randomUUID(),
): Promise<OrderResponse> {
  return client.post(API_ENDPOINTS.orders.create, {
    headers: { "Idempotency-Key": idempotencyKey },
    schema: orderResponseSchema,
    body: {
      ...values,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        grind: item.grind,
      })),
    },
  });
}
