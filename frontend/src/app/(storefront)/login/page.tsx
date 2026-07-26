import type { Metadata } from "next";
import { AuthPageShell } from "@/features/auth/components/auth-page-shell";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập hồ sơ DẤU VỊ để lưu gu cà phê và hành trình truy xuất.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <AuthPageShell mode="login" />;
}
