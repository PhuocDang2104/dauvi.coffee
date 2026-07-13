import Link from "next/link";

const codes = ["TR4-DLK-26-N02", "CAT-DL-26-W01", "TRS1-GL-26-N01"];

export default function LotNotFound() {
  return (
    <main id="main-content" className="shell flex min-h-[68vh] items-center py-20">
      <div className="topo-surface paper-card w-full p-8 text-center md:p-14">
        <p className="eyebrow">Lookup result</p><h1 className="section-heading mt-4">Không tìm thấy mã lô này</h1><p className="mx-auto mt-4 max-w-lg text-ink-700">Kiểm tra lại ký tự trên nhãn sản phẩm hoặc thử một mã demo bên dưới.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">{codes.map((code) => <Link key={code} href={`/traceability/${code}`} className="lot-code min-h-11 rounded-full border border-forest-800/20 bg-paper-100 px-4 py-3 text-xs font-bold">{code}</Link>)}</div>
        <Link className="button-primary mt-8" href="/traceability">Về trang tra cứu</Link>
      </div>
    </main>
  );
}
