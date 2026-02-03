import type { Metadata } from "next";
import {
  Montserrat,
  Nunito,
  Poppins,
  Inter,
  Manrope,
  Syne,
  Space_Grotesk,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Les Arsene Creatives | Digital Experience Agency",
  description: "We build Digital Empires. A premium design agency transforming brands through structural chaos, pixel-perfect precision, and human-centered innovation.",
};

import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import BackgroundTexture from "@/components/BackgroundTexture";
import Preloader from "@/components/Preloader";
import PromoPopup from "@/components/PromoPopup";
import CookieConsent from "@/components/CookieConsent";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${montserrat.variable} ${nunito.variable} ${poppins.variable} ${inter.variable} ${manrope.variable} ${syne.variable} ${spaceGrotesk.variable} ${jakarta.variable} antialiased bg-background-light dark:bg-background-dark text-gray-900 dark:text-white`}
      >
        <Preloader />
        <BackgroundTexture />
        <SmoothScroll>
          <PageTransition>{children}</PageTransition>
          <PromoPopup />
          <CookieConsent />
        </SmoothScroll>
      </body>
    </html>
  );
}
