import { normalizeSearch } from "@/features/search/domain/normalize-search";
import { ApiClient, API_ENDPOINTS } from "@/lib/api";
import { isChatbotApiEnabled } from "@/lib/data-source/feature-flags";
import { chatbotResponseSchema, type ChatbotResponse } from "../domain/chatbot.schema";

function getLocalResponse(rawMessage: string): ChatbotResponse {
  const message = normalizeSearch(rawMessage);

  if (message.includes("ma lo") || message.includes("truy xuat") || message.includes("nguon goc")) {
    return {
      message: "Bạn có thể nhập mã in trên gói để xem hành trình vùng trồng, sơ chế, rang và đóng gói. Hãy thử mã TR4-DLK-26-N02.",
      actions: [{ label: "Tra cứu mã lô", href: "/traceability" }],
    };
  }

  if (message.includes("phin") || message.includes("dam") || message.includes("caffeine")) {
    return {
      message: "Với gu đậm hoặc pha phin, TRS1 dễ tiếp cận còn TR4 có body dày và hồ sơ lô nổi bật.",
      actions: [
        { label: "Xem TRS1", href: "/shop/trs1-tay-nguyen-daily-phin" },
        { label: "Xem TR4", href: "/shop/tr4-dak-lak-traceable-robusta" },
      ],
    };
  }

  if (message.includes("it dang") || message.includes("arabica") || message.includes("pour") || message.includes("thom")) {
    return {
      message: "Catimor Đà Lạt cân bằng và dễ uống; Bourbon Langbiang thanh, thơm hơn với mật ong và cam ngọt.",
      actions: [
        { label: "Xem Catimor", href: "/shop/catimor-da-lat-washed" },
        { label: "Xem Bourbon", href: "/shop/bourbon-langbiang-honey" },
      ],
    };
  }

  if (message.includes("gia") || message.includes("ngan sach") || message.includes("re")) {
    return {
      message: "TRS1 250 g bắt đầu từ 99.000 ₫. Nếu muốn một hồ sơ truy xuất nổi bật hơn, TR4 bắt đầu từ 119.000 ₫.",
      actions: [{ label: "Lọc theo giá", href: "/shop?price=under-120000" }],
    };
  }

  return {
    message: "Mình có thể giúp bạn chọn theo cách pha, độ đậm, độ đắng, ngân sách hoặc tra cứu mã lô. Bạn muốn bắt đầu từ điều nào?",
    actions: [{ label: "Mở Coffee Advisor", href: "/advisor" }],
  };
}

export async function getCoffeeAssistantResponse(message: string): Promise<ChatbotResponse> {
  if (!isChatbotApiEnabled()) return getLocalResponse(message);

  return new ApiClient().post(API_ENDPOINTS.assistant.message, {
    body: { message },
    credentials: "include",
    schema: chatbotResponseSchema,
  });
}
