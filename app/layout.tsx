
import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Layout/Navbar";
import Continer from "@/components/global/Continer";
import MobileNav from "@/components/Layout/MobileNav";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://palshop.app"),
  title: "PALshop - Authentic Palestinian Products",
  description: "Discover authentic Palestinian handcrafted items, traditional foods, and unique treasures. Shop now and support Palestinian artisans.",
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
          className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
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
