import type { ReactNode } from "react";

import { AnnouncementBar } from "./announcement-bar";
import { DesktopHeader } from "./desktop-header";
import { HeaderSurface } from "./header-surface";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileHeader } from "./mobile-header";

export interface SiteHeaderProps {
  cartCount?: number;
  cartSlot?: ReactNode;
  transparent?: boolean;
}

export function SiteHeader({
  cartCount = 0,
  cartSlot,
  transparent = false,
}: SiteHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-50">
        <AnnouncementBar />
        <HeaderSurface transparent={transparent}>
          <DesktopHeader cartCount={cartCount} cartSlot={cartSlot} />
          <MobileHeader cartCount={cartCount} cartSlot={cartSlot} />
        </HeaderSurface>
      </header>
      <MobileBottomNav cartCount={cartCount} />
    </>
  );
}
