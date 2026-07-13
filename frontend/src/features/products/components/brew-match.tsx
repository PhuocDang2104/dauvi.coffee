import { Coffee, Droplets, Timer } from "lucide-react";
import type { BrewMethod, Product } from "@/features/products/domain/product.types";

const guides: Record<BrewMethod, { label: string; grind: string; dose: string; water: string; time: string; why: string }> = {
  phin: { label: "Phin Việt Nam", grind: "Vừa–mịn", dose: "20 g", water: "80–100 ml", time: "4–6 phút", why: "Làm nổi bật body và hậu vị đậm." },
  espresso: { label: "Espresso", grind: "Mịn", dose: "18 g", water: "36–40 ml", time: "25–30 giây", why: "Tạo cấu trúc dày và hương cacao rõ." },
  "pour-over": { label: "Pour-over", grind: "Vừa", dose: "15 g", water: "240 ml", time: "2:30–3:00", why: "Mở các lớp hương thơm và độ chua sáng." },
  aeropress: { label: "AeroPress", grind: "Vừa–mịn", dose: "15–17 g", water: "220 ml", time: "1:30–2:00", why: "Cân bằng độ ngọt, body và hương." },
  "french-press": { label: "French press", grind: "Thô", dose: "18 g", water: "270 ml", time: "4 phút", why: "Giữ body tròn và lớp dầu tự nhiên." },
  "moka-pot": { label: "Moka pot", grind: "Mịn–vừa", dose: "Theo rổ lọc", water: "Đến van", time: "3–5 phút", why: "Tạo tách đậm, hợp uống cùng sữa." },
  "cold-brew": { label: "Cold brew", grind: "Thô", dose: "60 g", water: "1 lít", time: "12–16 giờ", why: "Cho vị êm, ngọt và ít gắt hơn." },
  drip: { label: "Drip bag", grind: "Đã định lượng", dose: "12 g", water: "180–200 ml", time: "2–3 phút", why: "Tiện lợi mà vẫn giữ hương vị rõ." },
};

export function BrewMatch({ product }: { product: Product }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {product.brewMethods.slice(0, 3).map((method) => {
        const guide = guides[method];
        return (
          <article key={method} className="rounded-[1.35rem] border border-basalt-900/10 bg-white/65 p-5">
            <span className="flex size-10 items-center justify-center rounded-full bg-forest-950 text-white"><Coffee aria-hidden="true" size={18} /></span>
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em]">{guide.label}</h3>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div><dt className="font-bold text-ink-500">Kiểu xay</dt><dd className="mt-1 text-ink-950">{guide.grind}</dd></div>
              <div><dt className="font-bold text-ink-500">Liều lượng</dt><dd className="mt-1 text-ink-950">{guide.dose}</dd></div>
              <div><dt className="flex items-center gap-1 font-bold text-ink-500"><Droplets size={12} aria-hidden="true" /> Nước</dt><dd className="mt-1 text-ink-950">{guide.water}</dd></div>
              <div><dt className="flex items-center gap-1 font-bold text-ink-500"><Timer size={12} aria-hidden="true" /> Thời gian</dt><dd className="mt-1 text-ink-950">{guide.time}</dd></div>
            </dl>
            <p className="mt-4 border-t border-basalt-900/10 pt-4 text-xs leading-5 text-ink-700">{guide.why}</p>
          </article>
        );
      })}
    </div>
  );
}
