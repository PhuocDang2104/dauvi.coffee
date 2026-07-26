import { afterEach, describe, expect, it, vi } from "vitest";

import type { CartItem } from "@/features/cart/domain/cart.types";
import { createDemoOrder } from "@/features/checkout/services/create-demo-order";
import { ApiClient } from "@/lib/api/api-client";

const item: CartItem = {
  id: "tr4:tr4-whole-250:whole-bean",
  productId: "tr4",
  productSlug: "tr4-dak-lak-traceable-robusta",
  productName: "TR4 Đắk Lắk Traceable Robusta",
  productShortName: "TR4 Đắk Lắk",
  variantId: "tr4-whole-250",
  sku: "TR4-WB-250",
  format: "whole-bean",
  weightGrams: 250,
  grind: "whole-bean",
  quantity: 2,
  unitPrice: 1,
  currency: "VND",
};

afterEach(() => vi.restoreAllMocks());

describe("checkout order API", () => {
  it("sends identifiers instead of trusting the cart price snapshot", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          orderCode: "DV-260719-ABC123",
          recipientName: "Nguyễn Minh Anh",
          itemCount: 2,
          subtotal: 238_000,
          shippingFee: 30_000,
          total: 268_000,
          status: "demo-confirmed",
          createdAt: "2026-07-19T12:00:00Z",
        }),
        { status: 201, headers: { "content-type": "application/json" } },
      ),
    );

    const result = await createDemoOrder(
      {
        fullName: "Nguyễn Minh Anh",
        phone: "0901234567",
        email: "",
        province: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Bến Nghé",
        address: "01 Nguyễn Huệ",
        deliveryNote: "",
        shippingMethod: "standard",
        paymentMethod: "cod",
        acceptDemo: true,
      },
      [item],
      new ApiClient("https://api.example.test/api/v1"),
      "checkout-test-0001",
    );

    expect(result.total).toBe(268_000);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(String(options?.body));
    expect(body.items).toEqual([
      {
        productId: "tr4",
        variantId: "tr4-whole-250",
        quantity: 2,
        grind: "whole-bean",
      },
    ]);
    expect(body.items[0]).not.toHaveProperty("unitPrice");
    expect(new Headers(options?.headers).get("Idempotency-Key")).toBe(
      "checkout-test-0001",
    );
  });
});
