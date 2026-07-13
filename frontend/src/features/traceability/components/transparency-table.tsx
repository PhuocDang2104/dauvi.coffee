import type { EvidenceItem, EvidenceLevel } from "@/features/traceability/domain/traceability.types";

const evidenceMeta: Record<EvidenceLevel, { label: string; className: string }> = {
  verified: { label: "Verified", className: "bg-success-600/10 text-success-600" },
  "supplier-declared": { label: "Supplier Declared", className: "bg-warning-600/10 text-warning-600" },
  reference: { label: "Reference Data", className: "bg-[#64748b]/10 text-[#475569]" },
  demo: { label: "Demo Data", className: "bg-clay-500/10 text-roast-700" },
};

export function EvidencePill({ level }: { level: EvidenceLevel }) {
  const meta = evidenceMeta[level];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold ${meta.className}`}>{meta.label}</span>;
}

export function TransparencyTable({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <div className="overflow-x-auto rounded-[1.35rem] border border-basalt-900/10 bg-white/65">
      <table className="w-full min-w-[700px] border-collapse text-left text-sm">
        <caption className="sr-only">Bảng thuộc tính và mức bằng chứng của lô cà phê</caption>
        <thead className="bg-paper-100 text-xs uppercase tracking-[0.08em] text-ink-700">
          <tr>
            <th scope="col" className="px-5 py-4">Thuộc tính</th>
            <th scope="col" className="px-5 py-4">Giá trị</th>
            <th scope="col" className="px-5 py-4">Mức bằng chứng</th>
            <th scope="col" className="px-5 py-4">Nguồn</th>
            <th scope="col" className="px-5 py-4">Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {evidence.map((item) => (
            <tr key={item.key} className="border-t border-basalt-900/10 align-top">
              <th scope="row" className="px-5 py-4 font-bold text-ink-950">{item.label}</th>
              <td className="max-w-sm px-5 py-4 leading-6 text-ink-700">{item.value}</td>
              <td className="px-5 py-4"><EvidencePill level={item.level} /></td>
              <td className="px-5 py-4 text-ink-700">{item.sourceLabel ?? "Chưa công bố"}</td>
              <td className="lot-code px-5 py-4 text-xs text-ink-500">{item.verifiedAt ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
