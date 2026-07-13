"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ScanLine } from "lucide-react";

export function LotLookupForm({ demoCodes }: { demoCodes: string[] }) {
  const router = useRouter();
  const [lotCode, setLotCode] = useState("");

  const submitCode = (code: string) => {
    const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
    if (normalized) router.push(`/traceability/${encodeURIComponent(normalized)}`);
  };

  return (
    <div className="rounded-[1.6rem] border border-forest-950/15 bg-white/80 p-5 shadow-soft md:p-7">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitCode(lotCode);
        }}
      >
        <label htmlFor="lot-code" className="text-sm font-extrabold text-forest-950">Mã lô trên nhãn</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <ScanLine aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-600" size={20} />
            <input
              id="lot-code"
              name="lotCode"
              value={lotCode}
              required
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setLotCode(event.target.value.toUpperCase().replace(/\s+/g, ""))}
              className="lot-code min-h-14 w-full rounded-2xl border border-basalt-900/20 bg-mist-50 pl-12 pr-4 text-sm font-bold uppercase placeholder:font-sans placeholder:font-normal placeholder:tracking-normal"
              placeholder="Ví dụ: TR4-DLK-26-N02"
              aria-describedby="lot-code-help"
            />
          </div>
          <button type="submit" className="button-primary min-h-14 shrink-0 px-6">
            Tra cứu lô <ArrowRight aria-hidden="true" size={17} />
          </button>
        </div>
        <p id="lot-code-help" className="mt-3 text-xs leading-5 text-ink-500">Chưa hỗ trợ quét camera. Hãy nhập chính xác dãy ký tự trên gói.</p>
      </form>

      <div className="mt-5 border-t border-basalt-900/10 pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">Thử mã demo</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {demoCodes.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => { setLotCode(code); submitCode(code); }}
              className="lot-code min-h-10 rounded-full border border-forest-800/20 bg-paper-100 px-3 text-[0.68rem] font-bold text-forest-950 hover:border-forest-800"
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
