import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Source_Serif_4 } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { MobileAppNav } from "@/components/mobile-app-nav";
import { PwaRegister } from "@/components/pwa-register";
import { PwaInstallProvider } from "@/components/pwa-install-provider";
import { AppExperience } from "@/components/app-experience";
import { SiteAnalytics } from "@/components/site-analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RegionalPricingProvider } from "@/components/regional-pricing";
import { getPublicSiteSettings } from "@/lib/site-settings";
import "./globals.css";
import "./design-system.css";
import "./landing-analytics.css";
import "./inventory.css";
import "./marketplace.css";
import "./mobile-first.css";
import "./miniapp.css";
import "./account-mobile.css";
import "./account-home.css";
import "./launch.css";
import "./animal-editor.css";
import "./latam.css";

const appSans = Nunito_Sans({ variable: "--font-nunito-sans", subsets: ["latin"], display: "swap" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap", preload: false });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap", preload: false });
const editorialSerif = Source_Serif_4({ variable: "--font-editorial", subsets: ["latin"], display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cria360.vercel.app"),
  title: { default: "Gestión de criaderos en Latinoamérica | CRIA360", template: "%s | CRIA360" },
  description: "Administra tu criadero desde el celular. Inventario, ventas, gastos e identidad QR y NFC. Prueba CRIA360 gratis durante 30 días desde tu primer registro.",
  applicationName: "CRIA360",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  icons: {
    icon: [
      { url: "/icons/granja-conectada-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/granja-conectada-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/granja-conectada-apple.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "CRIA360" },
  formatDetection: { telephone: false },
  openGraph: {
    title: "CRIA360 · Animales con origen verificable",
    description: "Marketplace, identidad y gestión para criaderos con trazabilidad, genealogía y placas inteligentes.",
    locale: "es_PE",
    type: "website",
    siteName: "CRIA360",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRIA360 · Animales con origen verificable",
    description: "Marketplace, genealogía y placas inteligentes para criaderos.",
  },
};

export const viewport: Viewport = {
  themeColor: "#173f35",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getPublicSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cria360.vercel.app";
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.legal_name || "CRIA360",
      url: siteUrl,
      ...(settings.contact_email ? { email: settings.contact_email } : {}),
      ...(settings.whatsapp_number ? { telephone: `+${settings.whatsapp_number.replace(/\D/g, "")}` } : {}),
      ...(settings.google_business_url ? { sameAs: [settings.google_business_url] } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CRIA360",
      url: siteUrl,
      inLanguage: "es-PE",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/marketplace?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html lang="es" className={`${appSans.variable} ${geistSans.variable} ${geistMono.variable} ${editorialSerif.variable}`}>
      <body>
        <PwaInstallProvider>
        <RegionalPricingProvider>
        <AppExperience>
        <a className="skip-link" href="#main-content">Ir al contenido</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter whatsappNumber={settings.whatsapp_number} />
        <MobileAppNav />
        <FloatingWhatsApp number={settings.whatsapp_number} />
        <CookieConsent />
        <SiteAnalytics />
        <PwaRegister />
        </AppExperience>
        </RegionalPricingProvider>
        </PwaInstallProvider>
      </body>
    </html>
  );
}


