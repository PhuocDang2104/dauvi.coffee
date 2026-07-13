"use client";

import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Product } from "@/features/products/domain/product.types";
import {
  ADVISOR_DISCLOSURE,
  type AdvisorPreferences,
  type AdvisorPriority,
  type ProductRecommendation,
} from "../domain/advisor.types";
import { scoreProducts } from "../domain/score-products";
import { AdvisorProgress } from "./advisor-progress";
import { PreferenceChip } from "./preference-chip";
import { RecommendationCard } from "./recommendation-card";

interface AdvisorChatShellProps {
  products: Product[];
}

interface AdvisorDraft {
  intensity?: AdvisorPreferences["intensity"];
  bitterness?: AdvisorPreferences["bitterness"];
  acidity?: AdvisorPreferences["acidity"];
  brewMethod?: AdvisorPreferences["brewMethod"];
  caffeine?: AdvisorPreferences["caffeine"];
  priority?: AdvisorPriority;
}

interface AdvisorOption {
  value: string;
  label: string;
  description?: string;
}

interface AdvisorQuestion {
  key: keyof AdvisorDraft;
  title: string;
  helper: string;
  options: readonly AdvisorOption[];
}

const QUESTIONS: readonly AdvisorQuestion[] = [
  {
    key: "intensity",
    title: "Bạn thích tách cà phê đậm đến mức nào?",
    helper: "Nghĩ về cảm giác dày và độ hiện diện của cà phê trong miệng.",
    options: [
      { value: "light", label: "Thanh và nhẹ", description: "Body nhẹ, hương thơm rõ" },
      { value: "balanced", label: "Cân bằng", description: "Vừa đủ đậm, dễ uống" },
      { value: "bold", label: "Đậm và dày", description: "Body rõ, hợp gu phin" },
    ],
  },
  {
    key: "bitterness",
    title: "Bạn muốn vị đắng ra sao?",
    helper: "Không có lựa chọn đúng hay sai — chỉ là gu uống của bạn.",
    options: [
      { value: "low", label: "Ít đắng", description: "Ưu tiên cảm giác êm" },
      { value: "medium", label: "Đắng vừa", description: "Cân bằng với độ ngọt" },
      { value: "high", label: "Đắng rõ", description: "Hậu vị rang nổi bật" },
    ],
  },
  {
    key: "acidity",
    title: "Bạn có thích độ chua sáng của Arabica không?",
    helper: "Độ chua ở đây giống sắc thái cam hoặc trái cây, không phải vị chua hỏng.",
    options: [
      { value: "low", label: "Hầu như không", description: "Trầm, ít chua" },
      { value: "medium", label: "Một chút cân bằng", description: "Sáng vừa đủ" },
      { value: "high", label: "Có, càng rõ càng thích", description: "Ưu tiên hương trái cây" },
    ],
  },
  {
    key: "brewMethod",
    title: "Bạn thường pha bằng gì?",
    helper: "Advisor sẽ ưu tiên profile và kiểu xay phù hợp với dụng cụ này.",
    options: [
      { value: "phin", label: "Phin Việt Nam" },
      { value: "pour-over", label: "Pour-over" },
      { value: "aeropress", label: "AeroPress" },
      { value: "espresso", label: "Espresso" },
      { value: "moka-pot", label: "Moka pot" },
      { value: "french-press", label: "French press" },
      { value: "cold-brew", label: "Cold brew" },
      { value: "drip", label: "Drip bag" },
    ],
  },
  {
    key: "caffeine",
    title: "Bạn cần caffeine mức nào?",
    helper: "Robusta thường có mức caffeine cao hơn; Arabica trong collection ở mức vừa.",
    options: [
      { value: "medium", label: "Mức vừa", description: "Ưu tiên tách nhẹ nhàng hơn" },
      { value: "high", label: "Mức cao", description: "Cần năng lượng rõ rệt" },
    ],
  },
  {
    key: "priority",
    title: "Điều gì quan trọng nhất khi bạn chọn mua?",
    helper: "Lựa chọn này giúp phân hạng những sản phẩm có profile gần nhau.",
    options: [
      { value: "everyday", label: "Dễ uống mỗi ngày" },
      { value: "traceability", label: "Nguồn gốc rõ" },
      { value: "local-variety", label: "Giống Việt có câu chuyện" },
      { value: "premium", label: "Trải nghiệm premium" },
      { value: "budget-friendly", label: "Giá dễ tiếp cận" },
      { value: "quick-brew", label: "Pha nhanh, gọn" },
    ],
  },
] as const;

function buildPreferences(draft: AdvisorDraft): AdvisorPreferences | null {
  if (
    !draft.intensity ||
    !draft.bitterness ||
    !draft.acidity ||
    !draft.brewMethod ||
    !draft.caffeine ||
    !draft.priority
  ) {
    return null;
  }

  const quickBrew = draft.priority === "quick-brew" || draft.brewMethod === "drip";

  return {
    intensity: draft.intensity,
    bitterness: draft.bitterness,
    acidity: draft.acidity,
    brewMethod: draft.brewMethod,
    caffeine: draft.caffeine,
    format: quickBrew ? "drip-bag" : "ground",
    budgetMax: draft.priority === "budget-friendly" ? 120_000 : undefined,
    priorities:
      draft.priority === "everyday"
        ? ["everyday", "easy-to-brew"]
        : draft.priority === "quick-brew"
          ? ["quick-brew", "easy-to-brew"]
          : [draft.priority],
  };
}

function updateDraft(
  draft: AdvisorDraft,
  key: keyof AdvisorDraft,
  value: string,
): AdvisorDraft {
  switch (key) {
    case "intensity":
      return { ...draft, intensity: value as AdvisorPreferences["intensity"] };
    case "bitterness":
      return { ...draft, bitterness: value as AdvisorPreferences["bitterness"] };
    case "acidity":
      return { ...draft, acidity: value as AdvisorPreferences["acidity"] };
    case "brewMethod":
      return { ...draft, brewMethod: value as AdvisorPreferences["brewMethod"] };
    case "caffeine":
      return { ...draft, caffeine: value as AdvisorPreferences["caffeine"] };
    case "priority":
      return { ...draft, priority: value as AdvisorPriority };
  }
}

export function AdvisorChatShell({ products }: AdvisorChatShellProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<AdvisorDraft>({});
  const [preferences, setPreferences] = useState<AdvisorPreferences | null>(null);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [status, setStatus] = useState<"quiz" | "loading" | "results">("quiz");
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef<number | null>(null);
  const question = QUESTIONS[step];

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (status === "quiz") questionHeadingRef.current?.focus();
    if (status === "results") resultHeadingRef.current?.focus();
  }, [status, step]);

  const selectAnswer = (value: string) => {
    if (!question) return;
    const nextDraft = updateDraft(draft, question.key, value);
    setDraft(nextDraft);

    if (step < QUESTIONS.length - 1) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    const nextPreferences = buildPreferences(nextDraft);
    if (!nextPreferences) return;

    setPreferences(nextPreferences);
    setStatus("loading");
    timerRef.current = window.setTimeout(() => {
      setRecommendations(scoreProducts(products, nextPreferences));
      setStatus("results");
    }, 420);
  };

  const restart = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStep(0);
    setDraft({});
    setPreferences(null);
    setRecommendations([]);
    setStatus("quiz");
  };

  if (status === "loading") {
    return (
      <section
        className="mx-auto flex min-h-[28rem] max-w-3xl flex-col items-center justify-center rounded-[2rem] border border-[color:var(--sand-200)] bg-white px-6 py-14 text-center"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-[var(--forest-950)] text-white">
          <Sparkles className="size-6 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-display text-3xl text-[var(--ink-950)]">
          Đang đối chiếu khẩu vị của bạn với sáu sản phẩm…
        </h2>
        <p className="mt-3 max-w-md leading-7 text-[var(--ink-700)]">
          Bộ quy tắc đang so khớp cách pha, phổ vị, caffeine, quy cách và ưu tiên mua hàng.
        </p>
      </section>
    );
  }

  if (status === "results" && preferences) {
    return (
      <section aria-labelledby="advisor-results-title">
        <div className="flex flex-col justify-between gap-5 border-b border-[color:var(--sand-200)] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest-600)]">
              Kết quả Coffee Advisor
            </p>
            <h2
              ref={resultHeadingRef}
              id="advisor-results-title"
              tabIndex={-1}
              className="mt-2 max-w-2xl font-display text-3xl leading-tight text-[var(--ink-950)] outline-none sm:text-4xl"
            >
              {recommendations.length === 3
                ? "Ba dấu vị gần với khẩu vị của bạn"
                : recommendations.length > 0
                  ? "Những dấu vị đáp ứng lựa chọn của bạn"
                  : "Chưa có dấu vị đáp ứng mọi lựa chọn"}
            </h2>
          </div>
          <button
            type="button"
            onClick={restart}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-[color:var(--forest-950)] px-5 text-sm font-semibold text-[var(--forest-950)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Làm lại tư vấn
          </button>
        </div>

        {recommendations.length > 0 ? (
          <>
            {recommendations.length < 3 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-[color:var(--honey-500)] bg-white p-4 text-sm leading-6 text-[var(--ink-700)]">
                Catalog hiện chỉ có {recommendations.length} sản phẩm đáp ứng
                đầy đủ giới hạn quy cách hoặc ngân sách bạn chọn; Advisor không
                tự nới các điều kiện này để đủ ba kết quả.
              </p>
            ) : null}
            <div className="mt-8 grid gap-5 xl:grid-cols-3">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.product.id}
                  recommendation={recommendation}
                  preferences={preferences}
                  rank={index + 1}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-[color:var(--sand-200)] bg-white p-8 text-center">
            <h3 className="font-display text-2xl">Chưa có sản phẩm khớp hoàn toàn</h3>
            <p className="mx-auto mt-3 max-w-lg leading-7 text-[var(--ink-700)]">
              Quy cách hoặc ngân sách bạn chọn chưa có lựa chọn phù hợp trong sáu sản phẩm. Hãy làm lại và thử một ưu tiên khác.
            </p>
          </div>
        )}

        <p className="mt-8 rounded-2xl border border-[color:var(--sand-200)] bg-[var(--paper-100)] p-4 text-sm leading-6 text-[var(--ink-700)]">
          <strong className="text-[var(--ink-950)]">Cách tạo kết quả:</strong>{" "}
          {ADVISOR_DISCLOSURE}
        </p>
      </section>
    );
  }

  if (!question) return null;

  const selectedValue = draft[question.key];

  return (
    <section className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-[color:var(--sand-200)] bg-white shadow-[0_16px_40px_rgba(24,26,24,0.06)]">
      <div className="border-b border-[color:var(--sand-200)] bg-[var(--paper-100)] px-5 py-5 sm:px-8">
        <AdvisorProgress currentStep={step + 1} />
      </div>
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex items-start gap-4">
          <span className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--forest-950)] text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--forest-600)]">
              Câu hỏi {step + 1}
            </p>
            <h2
              ref={questionHeadingRef}
              tabIndex={-1}
              className="mt-2 font-display text-3xl leading-tight text-[var(--ink-950)] outline-none sm:text-4xl"
            >
              {question.title}
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-[var(--ink-700)]">
              {question.helper}
            </p>
          </div>
        </div>

        <fieldset className="mt-8">
          <legend className="sr-only">{question.title}</legend>
          <div
            className={`grid gap-3 ${
              question.options.length > 3 ? "sm:grid-cols-2" : ""
            }`}
          >
            {question.options.map((option) => (
              <PreferenceChip
                key={option.value}
                name={`advisor-${question.key}`}
                value={option.value}
                label={option.label}
                description={option.description}
                selected={selectedValue === option.value}
                onSelect={selectAnswer}
              />
            ))}
          </div>
        </fieldset>

        <div className="mt-8 flex min-h-11 items-center justify-between gap-4 border-t border-[color:var(--sand-200)] pt-5">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((currentStep) => currentStep - 1)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-[var(--forest-800)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest-600)]"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Quay lại
            </button>
          ) : (
            <span />
          )}
          <p className="text-right text-xs leading-5 text-[var(--ink-500)]">
            Chọn một đáp án để tiếp tục
          </p>
        </div>
      </div>
    </section>
  );
}
