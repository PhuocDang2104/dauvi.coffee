interface AdvisorProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export function AdvisorProgress({
  currentStep,
  totalSteps = 6,
}: AdvisorProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-500)]">
        <span>Coffee Advisor</span>
        <span className="font-mono tabular-nums">
          {currentStep}/{totalSteps}
        </span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--sand-200)]"
        role="progressbar"
        aria-label="Tiến trình tư vấn"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
      >
        <div
          className="h-full rounded-full bg-[var(--clay-500)] transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

