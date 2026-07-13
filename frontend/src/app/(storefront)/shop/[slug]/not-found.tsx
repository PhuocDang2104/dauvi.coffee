import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main id="main-content" className="shell flex min-h-[65vh] items-center py-20">
      <div className="topo-surface paper-card w-full p-8 text-center md:p-14">
        <p className="eyebrow">Sản phẩm không tồn tại</p>
        <h1 className="section-heading mt-4">Gói cà phê này chưa có trong bộ sưu tập.</h1>
        <p className="mx-auto mt-4 max-w-lg text-ink-700">Khám phá đủ sáu dòng cà phê hiện có hoặc để Coffee Advisor chọn theo khẩu vị.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link className="button-primary" href="/shop">Về bộ sưu tập</Link><Link className="button-secondary" href="/advisor">Mở Coffee Advisor</Link></div>
      </div>
    </main>
  );
}
