import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BookingProvider } from "../context/BookingContext";
import { BookingModal } from "../components/booking/BookingModal";
import siteData from "../data/site.json";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://adablive.com"),
  title: `${siteData.bandName} | Live Music Band & Sound Setup Services`,
  description: siteData.tagline,
  keywords: ["live band", "wedding band", "acoustic duet", "sound setup", "PA system rental", "audio engineering", "music booking"],
  authors: [{ name: siteData.bandName }],
  icons: {
    icon: "/favicon.ico",
    apple: "/images/logo/logo-icon.png",
  },
  openGraph: {
    title: `${siteData.bandName} | Live Band & Sound Engineering`,
    description: siteData.tagline,
    type: "website",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 691,
        height: 414,
        alt: "Adab Live - Live Music | Events | Entertainment",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} h-full antialiased`}>
      <body className="bg-white text-zinc-900 flex flex-col min-h-screen">
        <BookingProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  );
}
