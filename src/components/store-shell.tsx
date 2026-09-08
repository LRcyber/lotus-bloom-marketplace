import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function StoreShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-dvh flex-col"><SiteHeader /><main className="flex-1">{children}</main><SiteFooter /><CartDrawer /></div>;
}
