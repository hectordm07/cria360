import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileAppNav } from "@/components/mobile-app-nav";
import { PwaRegister } from "@/components/pwa-register";
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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "CRIA360" },
  formatDetection: { telephone: false },
  openGraph: { title: "CRIA360 · Animales con origen verificable", description: "Marketplace de animales, criaderos y placas inteligentes con trazabilidad.", locale: "es_PE", type: "website", siteName: "CRIA360" },
  twitter: { card: "summary_large_image", title: "CRIA360 · Animales con origen verificable", description: "Marketplace, genealogía y placas inteligentes para criaderos." },
};

export const viewport: Viewport = {
  themeColor: "#173f35",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body><SiteHeader /><main>{children}</main><SiteFooter /><MobileAppNav /><PwaRegister /></body>
    </html>
  );
}
