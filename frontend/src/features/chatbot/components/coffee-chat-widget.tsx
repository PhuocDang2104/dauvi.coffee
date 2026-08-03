"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { ArrowUpRight, Bot, Coffee, Send, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { ChatbotResponse } from "../domain/chatbot.schema";
import { getCoffeeAssistantResponse } from "../services/get-coffee-assistant-response";

interface ChatMessage extends ChatbotResponse {
  id: number;
  role: "assistant" | "user";
}

const QUICK_PROMPTS = ["Tìm cà phê pha phin", "Tôi thích ít đắng", "Tra cứu mã lô"];

const INITIAL_MESSAGE: ChatMessage = {
  id: 1,
  role: "assistant",
  message: "Chào bạn, mình là trợ lý cà phê DẤU VỊ. Hôm nay bạn muốn một tách như thế nào?",
  actions: [],
};

export function CoffeeChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [hasClearedHero, setHasClearedHero] = useState(false);
  const nextId = useRef(2);
  const descriptionId = useId();

  useEffect(() => {
    const updatePosition = () => setHasClearedHero(window.scrollY > 140);
    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || pending) return;

    setMessages((current) => [...current, { id: nextId.current++, role: "user", message, actions: [] }]);
    setInput("");
    setPending(true);

    try {
      const response = await getCoffeeAssistantResponse(message);
      setMessages((current) => [...current, { id: nextId.current++, role: "assistant", ...response }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          message: "Mình chưa kết nối được dịch vụ tư vấn. Bạn vẫn có thể dùng Coffee Advisor để nhận ba gợi ý ngay trên website.",
          actions: [{ label: "Mở Coffee Advisor", href: "/advisor" }],
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  if (pathname.startsWith("/checkout") || pathname.startsWith("/login") || pathname.startsWith("/register")) return null;

  return (
    <Dialog.Root modal={false} open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`group fixed bottom-[5.6rem] right-3 z-[60] grid size-14 place-items-center rounded-full border border-honey-500/35 bg-forest-950 text-honey-500 shadow-[0_16px_45px_rgba(16,42,32,.32)] transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-500 focus-visible:ring-offset-2 lg:bottom-6 lg:right-6 lg:size-16 ${pathname === "/" && !hasClearedHero ? "max-lg:pointer-events-none max-lg:translate-y-3 max-lg:opacity-0" : ""}`}
          aria-label="Mở trợ lý cà phê DẤU VỊ"
        >
          <span className="absolute inset-0 rounded-full border border-honey-500/30 motion-safe:animate-ping motion-reduce:animate-none" aria-hidden="true" />
          <Coffee aria-hidden="true" className="relative size-6 lg:size-7" strokeWidth={1.8} />
          <span className="absolute -left-1 -top-1 grid size-5 place-items-center rounded-full bg-honey-500 text-forest-950 shadow-md"><Sparkles aria-hidden="true" size={11} /></span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={descriptionId}
          className="fixed inset-x-3 bottom-[5.35rem] z-[70] flex max-h-[min(70dvh,38rem)] flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-mist-50 shadow-[0_28px_90px_rgba(16,42,32,.35)] outline-none data-[state=closed]:animate-out data-[state=open]:animate-in motion-reduce:animate-none sm:left-auto sm:right-5 sm:w-[25rem] lg:bottom-6"
        >
          <div className="relative overflow-hidden bg-forest-950 px-5 py-5 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(199,150,72,.24),transparent_42%)]" aria-hidden="true" />
            <div className="relative flex items-center gap-3 pr-10">
              <span className="grid size-11 place-items-center rounded-full bg-honey-500 text-forest-950"><Bot aria-hidden="true" size={20} /></span>
              <div>
                <Dialog.Title className="font-display text-xl font-semibold">DẤU VỊ Coffee Assistant</Dialog.Title>
                <Dialog.Description id={descriptionId} className="mt-0.5 text-[0.68rem] text-sand-200">Tư vấn nhanh · Truy xuất · Cách pha</Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white" aria-label="Đóng trợ lý">
              <X aria-hidden="true" size={19} />
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-paper-100/55 p-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-[0_8px_24px_rgba(24,26,24,.06)] ${message.role === "user" ? "rounded-br-md bg-forest-950 text-white" : "rounded-bl-md border border-basalt-900/8 bg-white text-ink-700"}`}>
                  <p>{message.message}</p>
                  {message.actions.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.actions.map((action) => (
                        <Link key={action.href} href={action.href} onClick={() => setOpen(false)} className="inline-flex min-h-9 items-center gap-1 rounded-full bg-paper-100 px-3 text-[0.68rem] font-bold text-forest-950">
                          {action.label} <ArrowUpRight aria-hidden="true" size={12} />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {pending ? (
              <div className="flex justify-start" role="status">
                <span className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-xs text-ink-500 shadow-sm">Đang tìm dấu vị phù hợp<span className="motion-safe:animate-pulse">…</span></span>
              </div>
            ) : null}
          </div>

          <div className="border-t border-basalt-900/10 bg-mist-50 p-3">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
              {QUICK_PROMPTS.map((prompt) => (
                <button key={prompt} type="button" onClick={() => void sendMessage(prompt)} className="min-h-9 shrink-0 rounded-full border border-forest-950/12 bg-white px-3 text-[0.65rem] font-bold text-forest-950 transition hover:border-honey-500/50 hover:bg-paper-100">
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="flex items-center gap-2">
              <label htmlFor="coffee-chat-input" className="sr-only">Nhập câu hỏi cho trợ lý cà phê</label>
              <input
                id="coffee-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={240}
                placeholder="Hỏi về gu, cách pha, mã lô…"
                className="min-h-11 min-w-0 flex-1 rounded-full border border-basalt-900/12 bg-white px-4 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20"
              />
              <button type="submit" disabled={!input.trim() || pending} className="grid size-11 shrink-0 place-items-center rounded-full bg-forest-950 text-white transition hover:bg-forest-800 disabled:opacity-45" aria-label="Gửi câu hỏi">
                <Send aria-hidden="true" size={17} />
              </button>
            </form>
            <p className="mt-2 text-center text-[0.58rem] leading-4 text-ink-500">AI chỉ trả lời từ catalog và hồ sơ demo của 6 dòng cà phê DẤU VỊ.</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
