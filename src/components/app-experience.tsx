"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "./logo-mark";
import { mobileAppScale } from "@/lib/mobile-app-scale";

function subscribe(change: () => void) {
  const media = window.matchMedia("(display-mode: standalone), (display-mode: minimal-ui)");
  media.addEventListener("change", change);
  return () => media.removeEventListener("change", change);
}
function standaloneSnapshot() {
  return window.matchMedia("(display-mode: standalone), (display-mode: minimal-ui)").matches
    || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}
const serverSnapshot = () => false;

function subscribeViewport(change: () => void) {
  window.addEventListener("resize", change, { passive: true });
  return () => window.removeEventListener("resize", change);
}
function viewportSnapshot() {
  if (!CSS.supports("zoom", "2")) return 1;
  const deviceWidth = Math.min(window.screen.width, window.outerWidth || window.screen.width);
  return mobileAppScale(window.innerWidth, deviceWidth, navigator.maxTouchPoints);
}
const serverViewport = () => 1;

export function AppExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const standalone = useSyncExternalStore(subscribe, standaloneSnapshot, serverSnapshot);
  const viewportScale = useSyncExternalStore(subscribeViewport, viewportSnapshot, serverViewport);
  const accountRoute = pathname === "/app" || pathname === "/ingresar" || pathname === "/registro"
    || pathname === "/cuenta" || pathname.startsWith("/cuenta/") || pathname === "/vista-app";

  useEffect(() => {
    // Older home-screen shortcuts may still launch the commercial home page.
    // Keep OAuth callbacks, QR deep links and account subpages intact.
    if (standalone && pathname === "/") router.replace("/app");
  }, [pathname, router, standalone]);

  const appMode = accountRoute || standalone;
  const scaleStyle = appMode && viewportScale > 1
    ? { "--app-viewport-scale": viewportScale, zoom: viewportScale } as CSSProperties
    : undefined;
  return <div className={appMode ? "app-experience" : "site-experience"} style={scaleStyle}>
    {pathname === "/" && <div className="standalone-launch" role="status"><LogoMark /><span>Abriendo tu criadero…</span></div>}
    {!accountRoute && <Link className="standalone-account-return" href="/cuenta">← Mi criadero</Link>}
    {children}
  </div>;
}
