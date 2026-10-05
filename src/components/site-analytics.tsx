"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const STORAGE_KEY = "cria360-consent-v1";

function analyticsAllowed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    return Boolean(JSON.parse(raw)?.analytics);
  } catch {
    return false;
  }
}

function deviceType() {
  const width = window.innerWidth;
  if (width <= 620) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
}

function referrerHost() {
  try {
    return document.referrer ? new URL(document.referrer).hostname : null;
  } catch {
    return null;
  }
}

async function sendEvent(eventName: "page_view" | "cta_click", path: string) {
  if (!analyticsAllowed()) return;
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        path,
        referrerHost: referrerHost(),
        deviceType: deviceType(),
      }),
    });
  } catch {
    // Analytics must never interrupt the user's experience.
  }
}

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    void sendEvent("page_view", pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const cta = target?.closest<HTMLElement>("[data-analytics-cta]");
      if (!cta) return;
      const label = cta.dataset.analyticsCta || "cta";
      void sendEvent("cta_click", `${pathname}#${label.slice(0, 100)}`);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}
