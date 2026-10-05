"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";

type BarcodeResult = { rawValue?: string };
type BarcodeDetectorLike = {
  detect(source: HTMLVideoElement): Promise<BarcodeResult[]>;
};
type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;

type NDEFRecordLike = {
  recordType?: string;
  mediaType?: string;
  data?: DataView;
};
type NDEFMessageLike = { records?: NDEFRecordLike[] };
type NDEFReadingEventLike = Event & { message?: NDEFMessageLike; serialNumber?: string };
type NDEFReaderLike = EventTarget & {
  scan(options?: { signal?: AbortSignal }): Promise<void>;
};
type NDEFReaderConstructor = new () => NDEFReaderLike;

function cleanScannedValue(raw: string) {
  const value = raw.trim();
  if (!value) return "";

  try {
    const url = new URL(value);
    const codeFromQuery = url.searchParams.get("code");
    if (codeFromQuery) return codeFromQuery.trim();
    const parts = url.pathname.split("/").filter(Boolean);
    return decodeURIComponent(parts.at(-1) ?? value).trim();
  } catch {
    return value;
  }
}

function decodeRecord(record: NDEFRecordLike) {
  if (!record.data) return "";
  try {
    return new TextDecoder().decode(record.data).replace(/^\u0002en/i, "").trim();
  } catch {
    return "";
  }
}

export function AnimalScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const nfcAbortRef = useRef<AbortController | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMessage, setCameraMessage] = useState("");
  const [nfcMessage, setNfcMessage] = useState("");
  const [manualCode, setManualCode] = useState("");

  const goToCode = (raw: string) => {
    const code = cleanScannedValue(raw);
    if (!code) return;
    stopCamera();
    nfcAbortRef.current?.abort();
    router.push(`/cuenta/escanear?code=${encodeURIComponent(code)}`);
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraMessage("");
    const Detector = (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
    if (!Detector) {
      setCameraMessage("El lector QR no está disponible en este navegador. Usa NFC o escribe el código.");
      return;
    }

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setCameraActive(true);

      const detector = new Detector({ formats: ["qr_code"] });
      intervalRef.current = window.setInterval(async () => {
        try {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          const codes = await detector.detect(videoRef.current);
          const value = codes.find((item) => item.rawValue)?.rawValue;
          if (value) goToCode(value);
        } catch {
          // Keep the camera running; transient frame errors are safe to ignore.
        }
      }, 350);
    } catch {
      setCameraMessage("No pudimos abrir la cámara. Revisa el permiso de cámara de CRIA360.");
      stopCamera();
    }
  };

  const startNfc = async () => {
    setNfcMessage("");
    const Reader = (window as Window & { NDEFReader?: NDEFReaderConstructor }).NDEFReader;
    if (!Reader) {
      setNfcMessage("NFC web no está disponible en este equipo o navegador. En Android funciona mejor desde Chrome/PWA.");
      return;
    }

    try {
      nfcAbortRef.current?.abort();
      const abortController = new AbortController();
      nfcAbortRef.current = abortController;
      const reader = new Reader();

      reader.addEventListener("reading", (event) => {
        const nfcEvent = event as NDEFReadingEventLike;
        const records = nfcEvent.message?.records ?? [];
        const decoded = records.map(decodeRecord).find(Boolean);
        const fallback = nfcEvent.serialNumber ?? "";
        goToCode(decoded || fallback);
      });

      reader.addEventListener("readingerror", () => {
        setNfcMessage("Acerca nuevamente la placa NFC al teléfono.");
      });

      await reader.scan({ signal: abortController.signal });
      setNfcMessage("Lector NFC activo. Acerca la placa al teléfono.");
    } catch {
      setNfcMessage("No se pudo activar NFC. Verifica que esté encendido y que CRIA360 tenga permiso.");
    }
  };

  const submitManual = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToCode(manualCode);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      nfcAbortRef.current?.abort();
    };
  }, []);

  return (
    <section className="scan-workspace" aria-label="Buscar animal por QR, NFC o código">
      <div className="scan-actions">
        <button className="scan-action-card" type="button" onClick={cameraActive ? stopCamera : startCamera}>
          <span className="scan-action-icon"><Icon name="scan" size={24} /></span>
          <span><strong>{cameraActive ? "Cerrar cámara" : "Escanear QR"}</strong><small>Usa la cámara trasera</small></span>
        </button>
        <button className="scan-action-card" type="button" onClick={startNfc}>
          <span className="scan-action-icon nfc-mark">N</span>
          <span><strong>Leer NFC</strong><small>Acerca la placa al celular</small></span>
        </button>
      </div>

      <div className={`scanner-camera ${cameraActive ? "is-active" : ""}`}>
        <video ref={videoRef} muted playsInline aria-label="Vista de cámara para escanear QR" />
        {cameraActive && <span className="scanner-frame" aria-hidden="true" />}
      </div>

      {(cameraMessage || nfcMessage) && <div className="scanner-message" aria-live="polite">{cameraMessage || nfcMessage}</div>}

      <form className="scanner-manual" onSubmit={submitManual}>
        <label htmlFor="manual-animal-code">Código manual</label>
        <div>
          <input
            id="manual-animal-code"
            value={manualCode}
            onChange={(event) => setManualCode(event.target.value)}
            placeholder="CRIA-…, placa o identificación"
            autoCapitalize="characters"
          />
          <button className="button button-primary" type="submit">Buscar</button>
        </div>
      </form>
    </section>
  );
}
