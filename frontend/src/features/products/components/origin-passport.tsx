import type { Product } from "@/features/products/domain/product.types";
import type { CoffeeLot } from "@/features/traceability/domain/traceability.types";
import { EvidencePill } from "@/features/traceability/components/transparency-table";

const processLabels: Record<string, string> = { natural: "Natural", honey: "Honey", washed: "Washed" };
const roastLabels: Record<string, string> = { light: "Light", "light-medium": "Light–medium", medium: "Medium", "medium-dark": "Medium–dark", dark: "Dark" };

export function OriginPassport({ product, lot }: { product: Product; lot: CoffeeLot }) {
  const fields = [
    ["Vùng", product.regionLabel],
    ["Dòng", product.species === "robusta" ? "Coffea canephora · Robusta" : "Coffea arabica"],
    ["Giống", product.variety],
    ["Độ cao", product.altitudeLabel],
    ["Sơ chế", processLabels[product.process]],
    ["Mức rang", roastLabels[product.roastLevel]],
  ];

  return (
    <div className="topo-surface overflow-hidden rounded-[1.7rem] border border-forest-950/15 bg-paper-100">
      <div className="flex flex-col justify-between gap-5 border-b border-forest-950/15 bg-forest-950 p-6 text-white sm:flex-row sm:items-center md:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sand-200">Coffee origin passport</p>
          <p className="lot-code mt-2 text-lg font-bold">{lot.lotCode}</p>
        </div>
        <EvidencePill level={lot.evidenceLevel} />
      </div>
      <dl className="grid sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([label, value]) => (
          <div key={label} className="border-b border-r border-forest-950/10 p-5 last:border-b-0">
            <dt className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-ink-500">{label}</dt>
            <dd className="mt-1.5 font-semibold text-forest-950 capitalize">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="m-5 rounded-2xl border border-clay-500/25 bg-white/65 p-4 text-sm leading-6 text-ink-700 md:m-8">
        <strong className="text-roast-700">Demo Data:</strong> {lot.demoDisclosure}
      </div>
    </div>
  );
}
