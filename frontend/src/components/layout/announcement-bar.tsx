"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { SITE_CONFIG } from "@/config/site";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let frame: number | undefined;
    try {
      if (
        window.sessionStorage.getItem(SITE_CONFIG.announcementSessionKey) ===
        "true"
      ) {
        frame = window.requestAnimationFrame(() => setVisible(false));
      }
    } catch {
      // The announcement remains visible when storage is unavailable.
    }

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.sessionStorage.setItem(SITE_CONFIG.announcementSessionKey, "true");
    } catch {
      // Dismissal still applies for the current render when storage is unavailable.
    }
  }

  if (!visible) return null;

  return (
    <div className="relative bg-[var(--forest-950,#102a20)] px-14 py-2 text-center text-xs font-semibold leading-5 text-white sm:px-16 sm:text-sm">
      <p>{SITE_CONFIG.announcement}</p>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
        aria-label="Đóng thông báo"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
