"use client";

import Link from "next/link";
import { usePwaInstall } from "./pwa-install-provider";

export function InstallAppButton() {
  const { prompt, installed, isIos, install } = usePwaInstall();
  if (installed) return <div className="install-ready"><p className="install-success">Ya estás usando CRIA360 como app.</p><Link className="button button-primary" href="/cuenta">Abrir mi criadero</Link></div>;
  if (prompt) return <button className="button button-primary install-button" type="button" onClick={install}>Instalar app</button>;
  return <div className="install-manual"><a className="button button-primary install-button" href={isIos ? "#instalar-iphone" : "#instalar-android"}>Instalar app</a><p className="install-hint">{isIos ? "En Safari: Compartir → Añadir a pantalla de inicio." : "En Chrome: menú ⋮ → Añadir a pantalla de inicio → Instalar."}</p></div>;
}

