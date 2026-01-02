import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import Script from "next/script";

import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Layout/Navbar";
import Continer from "@/components/global/Continer";
import MobileNav from "@/components/Layout/MobileNav";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#215732",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://palshop.app"),
  title: {
    default: "PALshop | Authentic Palestinian Heritage & Artisanship",
    template: "%s | PALshop"
  },
  description: "Experience the legacy of Palestine. Shop authentic handcrafted items, traditional oils, embroidery, and unique treasures directly from Palestinian artisans. Supporting local communities with every purchase.",
  keywords: [
    "Palestine", "Palestinian products", "authentic craftsmanship", "handcrafted",
    "olive oil", "embroidery", "tatreez", "Middle Eastern decor", "Gaza",
    "West Bank", "artisan made", "ethical shopping", "heritage"
  ],
  authors: [{ name: "PALshop Team" }],
  creator: "PALshop",
  publisher: "PALshop",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://palshop.app",
    siteName: "PALshop",
    title: "PALshop | Authentic Palestinian Heritage & Artisanship",
    description: "Discover verified authentic Palestinian goods. From traditional olive oil to intricate embroidery, experience the best of Palestinian craftsmanship.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PALshop | Authentically Palestinian",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PALshop - Authentic Palestinian Heritage",
    description: "Shop authentic handcrafted Palestinian treasures. Every purchase supports local artisans and their families.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-P43ZJTKV0G`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P43ZJTKV0G');
          `}
        </Script>
      </head>
      <Providers>
        <body
          className={`${inter.variable} antialiased`}
        >
          <Toaster theme="dark" position="bottom-center" closeButton expand={false} />
          <Navbar />
          <div className="block lg:hidden md:block">
            <MobileNav />
          </div>
          <Continer>
            {children}
            <Footer />
          </Continer>
        </body>
      </Providers>
    </html>
  );
}
