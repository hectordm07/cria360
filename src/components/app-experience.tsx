"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "./logo-mark";

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

export function AppExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const standalone = useSyncExternalStore(subscribe, standaloneSnapshot, serverSnapshot);
  const accountRoute = pathname === "/app" || pathname === "/ingresar" || pathname === "/registro"
    || pathname === "/cuenta" || pathname.startsWith("/cuenta/") || pathname === "/vista-app";

  useEffect(() => {
    // Older home-screen shortcuts may still launch the commercial home page.
    // Keep OAuth callbacks, QR deep links and account subpages intact.
    if (standalone && pathname === "/") router.replace("/app");
  }, [pathname, router, standalone]);

  return <div className={accountRoute || standalone ? "app-experience" : "site-experience"}>
    {pathname === "/" && <div className="standalone-launch" role="status"><LogoMark /><span>Abriendo tu criadero…</span></div>}
    {!accountRoute && <Link className="standalone-account-return" href="/cuenta">← Mi criadero</Link>}
    {children}
  </div>;
}
