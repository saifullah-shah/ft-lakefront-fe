import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PageViewTracker } from "../components/page-view-tracker";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { siteConfig } from "../lib/site-config";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Lakefront Capital & Development",
    template: "%s | Lakefront Capital & Development",
  },
  description: "A destination-development company creating distinct paths around Tarbela Lake.",
  applicationName: "Lakefront Capital & Development",
  alternates: { canonical: siteConfig.siteUrl },
  openGraph: {
    title: "Lakefront Capital & Development",
    description: "A considered relationship with Tarbela Lake.",
    type: "website",
    siteName: "Lakefront Capital & Development",
    url: siteConfig.siteUrl,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lakefront Capital & Development",
    description: "A considered relationship with Tarbela Lake.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf9f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a171b" },
  ],
};

/**
 * Applies the stored theme (or the system preference) before first paint.
 * Runs inline and blocking on purpose: anything later would let the light
 * palette paint first and then swap, which reads as a flash.
 */
const themeScript = `(function(){try{var s=localStorage.getItem('lf-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <PageViewTracker />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
