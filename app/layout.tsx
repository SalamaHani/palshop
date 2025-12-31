import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Layout/Navbar";
import Continer from "@/components/global/Continer";
import MobileNav from "@/components/Layout/MobileNav";
import Footer from "@/components/Footer";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://palshop.app"),
  title: {
    default: "PALshop - Authentic Palestinian Heritage & Artisanship",
    template: "%s | PALshop"
  },
  description: "Experience the legacy of Palestine. Shop authentic handcrafted items, traditional oils, embroidery, and unique treasures directly from Palestinian artisans. Supporting local communities with every purchase.",
  keywords: ["Palestine", "Palestinian products", "authentic craftsmanship", "handcrafted", "olive oil", "embroidery", "tatreez", "Middle Eastern decor"],
  authors: [{ name: "PALshop Team" }],
  creator: "PALshop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://palshop.app",
    siteName: "PALshop",
    title: "PALshop - Authentic Palestinian Heritage & Artisanship",
    description: "Discover verified authentic Palestinian goods. From traditional olive oil to intricate embroidery, experience the best of Palestinian craftsmanship.",
    images: [
      {
        url: "/og-image.jpg", // Make sure to add this or use a high-quality placeholder
        width: 1200,
        height: 630,
        alt: "PALshop - Authentically Palestinian",
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
    shortcut: "/favicon-16x16.png",
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
      <Providers>
        <body
          className={`${inter.variable} antialiased`}
        >
          <Toaster theme="dark" position="bottom-center" />
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
