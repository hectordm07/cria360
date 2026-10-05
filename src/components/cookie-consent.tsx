"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Consent = {
  necessary: true;
  analytics: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "cria360-consent-v1";

function saveConsent(analytics: boolean) {
  const consent: Consent = {
    necessary: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("cria360-consent-change", { detail: consent }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(STORAGE_KEY));
  }, []);

  if (!visible) return null;

  return (
    <aside className="cookie-consent" role="dialog" aria-label="Preferencias de privacidad" aria-live="polite">
      <div>
        <strong>Tu privacidad primero</strong>
        <p>
          Usamos almacenamiento necesario para que CRIA360 funcione. La analítica anónima solo se activa con tu permiso.
          {" "}<Link href="/cookies">Ver aviso de cookies</Link>.
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="button button-secondary" onClick={() => { saveConsent(false); setVisible(false); }}>
          Solo necesarias
        </button>
        <button type="button" className="button button-primary" onClick={() => { saveConsent(true); setVisible(false); }}>
          Aceptar analítica
        </button>
      </div>
    </aside>
  );
}
