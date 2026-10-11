"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type InstallState = { prompt: InstallPrompt | null; installed: boolean; isIos: boolean; install: () => Promise<void> };
const InstallContext = createContext<InstallState | null>(null);

// Capture the browser offer before visitors navigate to the installation page.
export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const frame = window.requestAnimationFrame(() => {
      setInstalled(standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
      setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    });
    const offered = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const completed = () => { setInstalled(true); setPrompt(null); };
    const displayChanged = () => setInstalled(standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    window.addEventListener("beforeinstallprompt", offered);
    window.addEventListener("appinstalled", completed);
    standalone.addEventListener("change", displayChanged);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("beforeinstallprompt", offered);
      window.removeEventListener("appinstalled", completed);
      standalone.removeEventListener("change", displayChanged);
    };
  }, []);
  async function install() {
    if (!prompt) return;
    const offered = prompt;
    setPrompt(null);
    try {
      await offered.prompt();
      await offered.userChoice;
    } catch {
      // Keep the manual instructions available if the browser declines.
    }
  }
  return <InstallContext.Provider value={{ prompt, installed, isIos, install }}>{children}</InstallContext.Provider>;
}

export function usePwaInstall() {
  const context = useContext(InstallContext);
  if (!context) throw new Error("PwaInstallProvider is required");
  return context;
}
