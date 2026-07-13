"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="vi">
      <body className="bg-mist-50 p-8 text-ink-950">
        <main className="mx-auto max-w-xl py-24">
          <h1 className="font-display text-4xl">DẤU VỊ cần một nhịp để tải lại.</h1>
          <p className="mt-4 text-ink-700">Đã có lỗi ngoài dự kiến. Dữ liệu trong giỏ hàng vẫn được lưu trên thiết bị.</p>
          <button className="button-primary mt-7" type="button" onClick={reset}>
            Tải lại giao diện
          </button>
        </main>
      </body>
    </html>
  );
}
