import { z } from "zod";

export const chatbotActionSchema = z.object({
  label: z.string().min(1),
  href: z.string().startsWith("/"),
});

export const chatbotResponseSchema = z.object({
  message: z.string().min(1),
  actions: z.array(chatbotActionSchema).max(3).default([]),
});

export type ChatbotResponse = z.infer<typeof chatbotResponseSchema>;
