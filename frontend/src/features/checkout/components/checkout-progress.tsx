import { Check } from "lucide-react";

interface CheckoutProgressProps {
  activeStep?: 1 | 2 | 3;
}

const STEPS = [
  "Thông tin người nhận",
  "Giao hàng",
  "Xác nhận đơn",
] as const;

export function CheckoutProgress({ activeStep = 1 }: CheckoutProgressProps) {
  return (
    <nav aria-label="Tiến trình thanh toán">
      <ol className="grid grid-cols-3 gap-2">
        {STEPS.map((step, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3;
          const isComplete = stepNumber < activeStep;
          const isCurrent = stepNumber === activeStep;

          return (
            <li
              key={step}
              className="relative flex min-w-0 flex-col items-center text-center"
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className={`relative z-10 inline-flex size-9 items-center justify-center rounded-full border text-sm font-semibold ${
                  isComplete || isCurrent
                    ? "border-[var(--forest-950)] bg-[var(--forest-950)] text-white"
                    : "border-[color:var(--sand-200)] bg-[var(--mist-50)] text-[var(--ink-500)]"
                }`}
              >
                {isComplete ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  stepNumber
                )}
              </span>
              <span
                className={`mt-2 text-[0.7rem] leading-4 sm:text-xs ${
                  isCurrent
                    ? "font-semibold text-[var(--ink-950)]"
                    : "text-[var(--ink-500)]"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

