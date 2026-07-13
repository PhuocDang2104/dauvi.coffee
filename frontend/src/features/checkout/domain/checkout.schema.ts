import { z } from "zod";

function isVietnamesePhoneNumber(value: string): boolean {
  const normalized = value.replace(/[\s.-]/g, "");
  return /^(?:\+84|0)\d{9}$/.test(normalized);
}

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ và tên người nhận."),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại.")
    .refine(
      isVietnamesePhoneNumber,
      "Số điện thoại chưa đúng định dạng Việt Nam.",
    ),
  email: z
    .union([
      z.literal(""),
      z.string().trim().email("Email chưa đúng định dạng."),
    ])
    .optional(),
  province: z.string().trim().min(2, "Vui lòng nhập tỉnh hoặc thành phố."),
  district: z.string().trim().min(2, "Vui lòng nhập quận hoặc huyện."),
  ward: z.string().trim().min(2, "Vui lòng nhập phường hoặc xã."),
  address: z.string().trim().min(5, "Vui lòng nhập địa chỉ cụ thể."),
  deliveryNote: z.string().trim().max(300, "Ghi chú tối đa 300 ký tự.").optional(),
  shippingMethod: z.literal("standard"),
  paymentMethod: z.literal("cod"),
  acceptDemo: z
    .boolean()
    .refine(
      (accepted) => accepted,
      "Vui lòng xác nhận đây là đơn trình diễn.",
    ),
});

