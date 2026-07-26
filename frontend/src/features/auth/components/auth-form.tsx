"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAuthEnabled } from "@/lib/data-source/feature-flags";
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from "../domain/auth.schema";
import { login, registerAccount } from "../services/auth-client";

type AuthMode = "login" | "register";

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} role="alert" className="mt-1.5 text-xs leading-5 text-danger-600">{message}</p> : null;
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const authEnabled = isAuthEnabled();
  const [showPassword, setShowPassword] = useState(false);
  const [successName, setSuccessName] = useState<string | null>(null);
  const isRegister = mode === "register";

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
  });

  async function submitLogin(values: LoginValues) {
    loginForm.clearErrors("root.server");
    if (!authEnabled) {
      loginForm.setError("root.server", { message: "Auth API đang tắt trong bản frontend demo. Bật NEXT_PUBLIC_ENABLE_AUTH=true khi backend /auth đã sẵn sàng." });
      return;
    }
    try {
      const session = await login(values);
      setSuccessName(session.user.fullName);
    } catch (error) {
      loginForm.setError("root.server", { message: error instanceof Error ? error.message : "Chưa thể đăng nhập. Vui lòng thử lại." });
    }
  }

  async function submitRegister(values: RegisterValues) {
    registerForm.clearErrors("root.server");
    if (!authEnabled) {
      registerForm.setError("root.server", { message: "Auth API đang tắt trong bản frontend demo. Form và contract đã sẵn sàng để nối backend." });
      return;
    }
    try {
      const session = await registerAccount(values);
      setSuccessName(session.user.fullName);
    } catch (error) {
      registerForm.setError("root.server", { message: error instanceof Error ? error.message : "Chưa thể tạo tài khoản. Vui lòng thử lại." });
    }
  }

  if (successName) {
    return (
      <div className="rounded-[1.5rem] border border-success-600/20 bg-success-600/5 p-7 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-success-600 text-white"><ShieldCheck aria-hidden="true" size={22} /></span>
        <h2 className="mt-5 font-display text-3xl font-semibold">Xin chào, {successName}</h2>
        <p className="mt-3 text-sm leading-6 text-ink-700">Phiên đăng nhập đã được backend xác nhận bằng cookie bảo mật.</p>
        <Button asChild className="mt-6"><Link href="/shop">Khám phá bộ sưu tập <ArrowRight aria-hidden="true" size={16} /></Link></Button>
      </div>
    );
  }

  if (isRegister) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = registerForm;
    return (
      <form onSubmit={handleSubmit(submitRegister)} noValidate className="space-y-4">
        <div>
          <label htmlFor="register-full-name" className="mb-1.5 block text-sm font-semibold text-ink-700">Họ và tên</label>
          <Input id="register-full-name" autoComplete="name" placeholder="Nguyễn Minh Anh" invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "register-full-name-error" : undefined} {...register("fullName")} />
          <FieldError id="register-full-name-error" message={errors.fullName?.message} />
        </div>
        <div>
          <label htmlFor="register-email" className="mb-1.5 block text-sm font-semibold text-ink-700">Email</label>
          <Input id="register-email" type="email" autoComplete="email" placeholder="ban@example.com" invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} {...register("email")} />
          <FieldError id="register-email-error" message={errors.email?.message} />
        </div>
        <PasswordField id="register-password" label="Mật khẩu" show={showPassword} setShow={setShowPassword} error={errors.password?.message} registration={register("password")} autoComplete="new-password" />
        <PasswordField id="register-confirm-password" label="Xác nhận mật khẩu" show={showPassword} setShow={setShowPassword} error={errors.confirmPassword?.message} registration={register("confirmPassword")} autoComplete="new-password" />
        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-paper-100 p-3 text-xs leading-5 text-ink-700">
          <input type="checkbox" className="mt-1 size-4 accent-forest-950" {...register("acceptTerms")} />
          <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật của DẤU VỊ.</span>
        </label>
        <FieldError id="register-terms-error" message={errors.acceptTerms?.message} />
        {errors.root?.server ? <p role="alert" className="rounded-xl border border-clay-500/20 bg-clay-500/5 p-3 text-sm leading-6 text-roast-700">{errors.root.server.message}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Đang tạo tài khoản…" : "Tạo tài khoản"}<ArrowRight aria-hidden="true" size={16} /></Button>
      </form>
    );
  }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = loginForm;
  return (
    <form onSubmit={handleSubmit(submitLogin)} noValidate className="space-y-4">
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-ink-700">Email</label>
        <Input id="login-email" type="email" autoComplete="email" placeholder="ban@example.com" invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} {...register("email")} />
        <FieldError id="login-email-error" message={errors.email?.message} />
      </div>
      <PasswordField id="login-password" label="Mật khẩu" show={showPassword} setShow={setShowPassword} error={errors.password?.message} registration={register("password")} autoComplete="current-password" />
      <div className="flex items-center justify-between gap-4 text-xs">
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-ink-700"><input type="checkbox" className="size-4 accent-forest-950" {...register("remember")} /> Ghi nhớ tôi</label>
        <span className="text-ink-500">Quên mật khẩu · sắp có</span>
      </div>
      {errors.root?.server ? <p role="alert" className="rounded-xl border border-clay-500/20 bg-clay-500/5 p-3 text-sm leading-6 text-roast-700">{errors.root.server.message}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}<ArrowRight aria-hidden="true" size={16} /></Button>
    </form>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  show: boolean;
  setShow: (show: boolean) => void;
  error?: string;
  registration: UseFormRegisterReturn;
  autoComplete: string;
}

function PasswordField({ id, label, show, setShow, error, registration, autoComplete }: PasswordFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-700">{label}</label>
      <div className="relative">
        <Input id={id} type={show ? "text" : "password"} autoComplete={autoComplete} invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="pr-12" {...registration} />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-1 top-1 grid size-10 place-items-center rounded-full text-ink-500 transition hover:bg-paper-100 hover:text-ink-950" aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
          {show ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
        </button>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function AuthPreviewNotice() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-honey-500/25 bg-honey-500/8 p-3 text-xs leading-5 text-roast-700">
      <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>Form đã nối contract backend bằng cookie HttpOnly. Chế độ hiện tại chưa tạo phiên thật.</p>
    </div>
  );
}
