import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { isAuthEnabled } from "@/lib/data-source/feature-flags";
import { AuthForm, AuthPreviewNotice } from "./auth-form";

export function AuthPageShell({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  return (
    <main id="main-content" className="min-h-[calc(100svh-7rem)] bg-paper-100 py-8 md:py-14">
      <div className="shell grid overflow-hidden rounded-[2rem] border border-basalt-900/10 bg-mist-50 shadow-[0_28px_90px_rgba(24,26,24,.12)] lg:grid-cols-[.95fr_1.05fr]">
        <div className="relative hidden min-h-[42rem] overflow-hidden lg:block">
          <Image src="/images/home/homecard-2.png" alt="Cà phê được rót vào tách gốm" fill priority sizes="42vw" className="object-cover object-[58%_center]" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/10 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <p className="eyebrow !text-honey-500">DẤU VỊ MEMBERS</p>
            <h2 className="mt-4 max-w-lg font-display text-4xl font-semibold leading-tight">Lưu gu cà phê và tiếp tục hành trình của riêng bạn.</h2>
          </div>
        </div>
        <div className="p-6 sm:p-10 lg:p-12">
          <BrandLogo href="/" />
          <div className="mt-10">
            <p className="eyebrow">{isRegister ? "Tạo hồ sơ DẤU VỊ" : "Chào mừng trở lại"}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">{isRegister ? "Bắt đầu hành trình vị giác" : "Đăng nhập DẤU VỊ"}</h1>
            <p className="mt-3 text-sm leading-6 text-ink-700">{isRegister ? "Lưu sản phẩm yêu thích và kết quả Coffee Advisor." : "Tiếp tục từ những dấu vị bạn đã lưu."}</p>
          </div>
          <div className="mt-8">
            {!isAuthEnabled() ? <AuthPreviewNotice /> : null}
            <AuthForm mode={mode} />
          </div>
          <p className="mt-7 text-center text-sm text-ink-700">
            {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
            <Link href={isRegister ? "/login" : "/register"} className="font-bold text-forest-950 underline decoration-honey-500/55 underline-offset-4">{isRegister ? "Đăng nhập" : "Đăng ký"}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
