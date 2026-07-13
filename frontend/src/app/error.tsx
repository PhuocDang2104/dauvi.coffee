"use client";

import { RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" className="shell flex min-h-[65vh] items-center py-20">
      <div className="paper-card topo-surface w-full p-8 md:p-14">
        <p className="eyebrow">Gián đoạn tạm thời</p>
        <h1 className="section-heading mt-4 max-w-2xl">Trang này chưa thể hiển thị trọn vẹn.</h1>
        <p className="mt-5 max-w-xl text-ink-700">
          Vui lòng thử tải lại. Nếu đang dùng nguồn dữ liệu HTTP, hãy kiểm tra kết nối backend đã cấu hình.
        </p>
        <button type="button" onClick={reset} className="button-primary mt-8">
          <RotateCcw aria-hidden="true" size={17} /> Thử lại
        </button>
      </div>
    </main>
  );
}
