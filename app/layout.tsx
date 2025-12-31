
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
