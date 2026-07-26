"use client";

import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface CheckoutFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id"
> {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  optional?: boolean;
}

export function CheckoutField({
  id,
  label,
  registration,
  error,
  optional = false,
  className = "",
  ...inputProps
}: CheckoutFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between gap-2 text-sm font-semibold text-[var(--ink-700)]"
      >
        <span>{label}</span>
        {optional ? (
          <span className="text-xs font-normal text-[var(--ink-500)]">
            Không bắt buộc
          </span>
        ) : null}
      </label>
      <input
        id={id}
        {...registration}
        {...inputProps}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className="min-h-12 w-full rounded-xl border border-[color:var(--sand-200)] bg-white px-4 text-base text-[var(--ink-950)] outline-none transition-colors placeholder:text-[var(--ink-500)] focus:border-[var(--forest-600)] focus:ring-2 focus:ring-[color:var(--forest-600)]/20"
      />
      {error ? (
        <p
          id={errorId}
          className="mt-2 text-sm leading-5 text-[var(--danger-600)]"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
