import type { Metadata } from "next";
import { CheckoutForm } from "@/features/checkout";

export const metadata: Metadata = { title: "Checkout demo", description: "Luồng xác nhận đơn hàng frontend mô phỏng của DẤU VỊ.", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <main id="main-content" data-checkout-page>
      <header className="border-b border-basalt-900/10 bg-paper-100 py-8 md:py-12">
        <div className="shell"><p className="eyebrow">Frontend demo checkout</p><h1 className="section-heading mt-3">Thông tin nhận hàng</h1></div>
      </header>
      <div className="shell py-10 md:py-16"><CheckoutForm /></div>
    </main>
  );
}
