import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo hồ sơ DẤU VỊ để lưu sản phẩm yêu thích và kết quả Coffee Advisor.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return <AuthPageShell mode="register" />;
}
