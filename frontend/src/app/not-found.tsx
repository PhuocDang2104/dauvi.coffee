import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="shell flex min-h-[68vh] items-center py-20">
      <div className="paper-card topo-surface w-full overflow-hidden p-8 md:p-16">
        <p className="lot-code text-sm text-clay-500">404 · NGOÀI TUYẾN HÀNH TRÌNH</p>
        <h1 className="display-heading mt-5 max-w-3xl">Chưa tìm thấy dấu vị bạn đang tìm.</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-700">
          Đường dẫn có thể đã thay đổi. Bạn có thể trở về bộ sưu tập hoặc tra cứu một mã lô demo.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link className="button-primary" href="/shop">
            Xem bộ sưu tập <ArrowRight aria-hidden="true" size={17} />
          </Link>
          <Link className="button-secondary" href="/traceability">
            Tra cứu mã lô
          </Link>
        </div>
      </div>
    </main>
  );
}
