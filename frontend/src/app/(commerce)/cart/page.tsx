import type { Metadata } from "next";
import { CartPage } from "@/features/cart";

export const metadata: Metadata = { title: "Giỏ hàng", description: "Kiểm tra sản phẩm, quy cách, kiểu xay và số lượng trong giỏ DẤU VỊ.", robots: { index: false, follow: true } };

export default function CartRoute() {
  return (
    <main id="main-content">
      <header className="border-b border-basalt-900/10 bg-paper-100 py-10 md:py-14">
        <div className="shell"><p className="eyebrow">Your coffee selection</p><h1 className="section-heading mt-3">Giỏ hàng của bạn</h1><p className="mt-3 text-ink-700">Kiểm tra quy cách, kiểu xay và số lượng trước khi tiếp tục.</p></div>
      </header>
      <div className="shell py-10 md:py-16"><CartPage /></div>
    </main>
  );
}
