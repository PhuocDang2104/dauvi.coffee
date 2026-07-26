import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Email chưa đúng định dạng."),
  password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự."),
  remember: z.boolean(),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Vui lòng nhập họ và tên."),
    email: z.string().trim().email("Email chưa đúng định dạng."),
    password: z
      .string()
      .min(8, "Mật khẩu cần ít nhất 8 ký tự.")
      .regex(/[A-Za-zÀ-ỹ]/, "Mật khẩu cần có ít nhất một chữ cái.")
      .regex(/[0-9]/, "Mật khẩu cần có ít nhất một chữ số."),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(Boolean, "Bạn cần đồng ý điều khoản để tiếp tục."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Mật khẩu xác nhận chưa trùng khớp.",
    path: ["confirmPassword"],
  });

export const authUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
});

export const authSessionSchema = z.object({
  user: authUserSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
