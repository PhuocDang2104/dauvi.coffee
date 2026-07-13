import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Coffee, Database, FileText, MessageCircleMore, ShieldCheck } from "lucide-react";

export function AdvisorCallout() {
  const prompts = [
    "Tôi uống phin mỗi sáng",
    "Tôi thích ít đắng hơn",
    "Tôi muốn thử Arabica",
    "Tôi cần drip bag tiện lợi",
  ];

  return (
    <section className="section-space bg-forest-950 text-mist-50">
      <div className="shell grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow !text-honey-500">Coffee Advisor</p>
          <h2 className="section-heading mt-4">Không cần biết hết thuật ngữ để chọn đúng cà phê</h2>
          <Link href="/advisor" className="button-primary mt-8 !bg-mist-50 !text-forest-950">
            Bắt đầu tư vấn <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div className="rounded-[1.8rem] border border-white/15 bg-white/5 p-5 backdrop-blur md:p-8">
          <div className="flex items-center gap-3 border-b border-white/15 pb-5">
            <span className="flex size-11 items-center justify-center rounded-full bg-honey-500 text-forest-950"><MessageCircleMore aria-hidden="true" size={20} /></span>
            <p className="font-bold">DẤU VỊ Coffee Advisor</p>
          </div>
          <p className="mt-6 font-display text-2xl font-semibold">Bạn đang tìm một tách cà phê như thế nào?</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {prompts.map((prompt) => <div key={prompt} className="flex min-h-12 items-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-semibold">{prompt}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HonestSustainability() {
  const levels = [
    { icon: ShieldCheck, label: "Verified", copy: "Có chứng nhận hoặc tài liệu xác minh. Chỉ dùng khi hồ sơ thực sự cung cấp bằng chứng.", tone: "text-success-600 bg-success-600/10" },
    { icon: FileText, label: "Supplier Declared", copy: "Thông tin do trang trại hoặc nhà cung cấp công bố; chưa đồng nghĩa với xác minh độc lập.", tone: "text-warning-600 bg-warning-600/10" },
    { icon: Database, label: "Reference Data", copy: "Kiến thức tham khảo về giống, không đại diện cho toàn bộ lô sản phẩm.", tone: "text-[#475569] bg-[#64748b]/10" },
    { icon: CheckCircle2, label: "Demo Data", copy: "Thông tin mô phỏng để trình diễn cấu trúc sản phẩm và truy xuất của hệ thống.", tone: "text-roast-700 bg-clay-500/10" },
  ];

  return (
    <section className="section-space shell">
      <div className="max-w-3xl">
        <p className="eyebrow">Honest sustainability</p>
        <h2 className="section-heading mt-4">Minh bạch trước khi gắn nhãn</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {levels.map(({ icon: Icon, label, copy, tone }) => (
          <article key={label} className="rounded-[1.35rem] border border-basalt-900/10 bg-white/70 p-5 shadow-[0_12px_40px_rgba(24,26,24,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-soft">
            <span className={`flex size-10 items-center justify-center rounded-full ${tone}`}><Icon aria-hidden="true" size={18} /></span>
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em]">{label}</h3>
            <p className="mt-3 text-sm leading-6 text-ink-700">{copy}</p>
          </article>
        ))}
      </div>
      <p className="mt-5 rounded-2xl border border-clay-500/20 bg-clay-500/5 p-5 text-sm leading-6 text-roast-700">
        Không sử dụng các claim “organic”, “water-saving”, “carbon neutral” hoặc “deforestation-free” nếu hồ sơ sản phẩm chưa có bằng chứng tương ứng.
      </p>
    </section>
  );
}

export function BrewAtHome() {
  const pathways = [
    { title: "Phin Việt Nam", grind: "Vừa–mịn", dose: "20 g", water: "80–100 ml", time: "4–6 phút", products: "TRS1 · TR4 · Xanh Lùn" },
    { title: "Pour-over / AeroPress", grind: "Vừa", dose: "15–17 g", water: "220–240 ml", time: "2–3 phút", products: "Catimor · Bourbon · TR9" },
    { title: "Drip bag", grind: "Đã định lượng", dose: "12 g", water: "180–200 ml", time: "2–3 phút", products: "Catimor Đà Lạt" },
  ];

  return (
    <section className="section-space border-y border-basalt-900/10 bg-paper-100">
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="eyebrow">Brew at home</p><h2 className="section-heading mt-4">Một gói cà phê, nhiều nhịp pha</h2></div>
          <Link href="/brew-guide" className="button-secondary self-start md:self-auto">Xem hướng dẫn pha <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pathways.map((pathway, index) => (
            <article key={pathway.title} className="rounded-[1.5rem] border border-basalt-900/10 bg-mist-50 p-6 shadow-[0_12px_40px_rgba(24,26,24,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-soft md:p-7">
              <div className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-full bg-forest-950 text-white"><Coffee aria-hidden="true" size={20} /></span><span className="lot-code text-xs text-ink-500">0{index + 1}</span></div>
              <h3 className="card-heading mt-6">{pathway.title}</h3>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div><dt className="font-bold text-ink-500">Kiểu xay</dt><dd className="mt-1 font-semibold">{pathway.grind}</dd></div>
                <div><dt className="font-bold text-ink-500">Liều lượng</dt><dd className="mt-1 font-semibold">{pathway.dose}</dd></div>
                <div><dt className="font-bold text-ink-500">Nước</dt><dd className="mt-1 font-semibold">{pathway.water}</dd></div>
                <div><dt className="flex items-center gap-1 font-bold text-ink-500"><Clock3 aria-hidden="true" size={12} /> Thời gian</dt><dd className="mt-1 font-semibold">{pathway.time}</dd></div>
              </dl>
              <p className="mt-5 border-t border-basalt-900/10 pt-4 text-xs leading-5 text-ink-700"><strong>Phù hợp:</strong> {pathway.products}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="shell py-16 md:py-24">
      <div className="topo-surface grid gap-8 rounded-[1.8rem] bg-clay-500 p-7 text-white md:grid-cols-[1fr_.8fr] md:items-center md:p-12">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-paper-100">Field Notes từ cao nguyên</p><h2 className="card-heading mt-3 text-3xl md:text-4xl">Nhận câu chuyện vùng trồng, cách pha và các lô mới.</h2></div>
        <form className="flex flex-col gap-3 sm:flex-row" action="#">
          <label htmlFor="newsletter-email" className="sr-only">Email nhận Field Notes</label>
          <input id="newsletter-email" type="email" required placeholder="Email của bạn" className="min-h-12 min-w-0 flex-1 rounded-full border border-white/35 bg-white/10 px-5 text-white placeholder:text-white/75" />
          <button type="submit" className="min-h-12 rounded-full bg-forest-950 px-6 text-sm font-bold">Đăng ký</button>
        </form>
      </div>
    </section>
  );
}
