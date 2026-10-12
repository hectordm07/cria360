"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || window.self !== window.top) return;

    const wasControlled = Boolean(navigator.serviceWorker.controller);
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing || !wasControlled) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
      .then(async (registration) => {
        await registration.update();
        const waiting = registration.waiting;
        if (waiting) waiting.postMessage({ type: "SKIP_WAITING" });
      })
      .catch(() => {
        // The website remains fully functional if installation is unavailable.
      });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  return null;
}


