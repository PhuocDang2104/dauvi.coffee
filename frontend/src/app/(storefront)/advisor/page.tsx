import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { getRepositories } from "@/lib/data-source";
import { AdvisorChatShell } from "@/features/advisor/components/advisor-chat-shell";

export const metadata: Metadata = {
  title: "Coffee Advisor",
  description: "Trả lời sáu câu hỏi về khẩu vị, cách pha, caffeine và ưu tiên để nhận ba gợi ý từ bộ sưu tập DẤU VỊ.",
  alternates: { canonical: "/advisor" },
};

export default async function AdvisorPage() {
  const products = await getRepositories().products.list();
  return (
    <main id="main-content" className="min-h-[80vh] bg-paper-100">
      <header className="topo-surface border-b border-basalt-900/10 py-14 md:py-20">
        <div className="shell grid gap-7 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div><p className="eyebrow flex items-center gap-2"><Sparkles aria-hidden="true" size={14} /> DẤU VỊ Coffee Advisor</p><h1 className="display-heading mt-5">Bắt đầu từ tách cà phê bạn muốn.</h1></div>
          <p className="max-w-xl text-lg leading-8 text-ink-700 lg:justify-self-end">Sáu câu hỏi ngắn, không cần thuật ngữ chuyên môn. Kết quả chỉ chọn trong sáu sản phẩm hiện có.</p>
        </div>
      </header>
      <section className="shell py-10 md:py-16"><AdvisorChatShell products={products} /></section>
    </main>
  );
}
