import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://cria360.pe"),
  title: { default: "CRIA360 | Identidad y gestión para criaderos", template: "%s | CRIA360" },
  description: "Identidad digital, genealogía, salud, trazabilidad y marketplace para criaderos de todas las especies.",
  openGraph: { title: "CRIA360", description: "La identidad digital de cada generación.", locale: "es_PE", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body><SiteHeader /><main>{children}</main><SiteFooter /></body>
    </html>
  );
}
