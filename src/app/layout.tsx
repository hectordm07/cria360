import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cria360.vercel.app"),
  title: { default: "Venta de animales y criaderos en Perú | CRIA360", template: "%s | CRIA360" },
  description: "Encuentra animales de criaderos en Perú con procedencia, salud y genealogía. Publica gratis y protege cada ejemplar con una placa QR CRIA360.",
  applicationName: "CRIA360",
  openGraph: { title: "CRIA360 · Animales con origen verificable", description: "Marketplace de animales, criaderos y placas inteligentes con trazabilidad.", locale: "es_PE", type: "website", siteName: "CRIA360" },
  twitter: { card: "summary_large_image", title: "CRIA360 · Animales con origen verificable", description: "Marketplace, genealogía y placas inteligentes para criaderos." },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body><SiteHeader /><main>{children}</main><SiteFooter /></body>
    </html>
  );
}
