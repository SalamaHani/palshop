import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="bg-white mt-32 md:mb-5 dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
          {/* Brand Section */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.jpeg"
                alt="Logo"
                width={140}
                height={40}
                className="object-contain"
              />
            </Link>
            <p className="text-[15px] leading-relaxed font-medium text-[#677279] dark:text-gray-400">
              Your trusted Palestinian marketplace for authentic products and
              handcrafted treasures.
            </p>
            <div className="flex items-center gap-5 mt-2">
              <a
                href="#"
                className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-[#215732] hover:text-white transition-all duration-300"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-[#215732] hover:text-white transition-all duration-300"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-[#215732] hover:text-white transition-all duration-300"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight uppercase">
              Legal
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/terms"
                  className="text-[15px] font-medium text-[#677279] dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[15px] font-medium text-[#677279] dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[15px] font-medium text-[#677279] dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Do Not Sell or Share My Personal Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight uppercase">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3.5 text-[#677279] dark:text-gray-400">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" />
                <span className="text-[15px] font-medium">Palestine, Ramallah</span>
              </li>
              <li className="flex items-start gap-3.5 text-[#677279] dark:text-gray-400">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" />
                <span className="text-[15px] font-medium">+970 xx xxx xxxx</span>
              </li>
              <li className="flex items-start gap-3.5 text-[#677279] dark:text-gray-400">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" />
                <span className="text-[15px] font-medium">info@palshop.app</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className=" md:mt-10 md:pt-10  pt-4 mp-5   border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1.5 text-[#677279] dark:text-gray-400 text-[13px]">
            <span className="font-semibold">Powered by</span>
            <div className="flex items-center gap-1 ml-1">
              <Image
                src="/images/shopify_glyph_black.png"
                alt="Shopify"
                width={18}
                height={18}
                className="opacity-80 dark:invert"
              />
              <span className="font-bold tracking-tight italic text-gray-500 dark:text-gray-400 ml-0.5">shopify</span>
            </div>
          </div>

          <div className="flex items-center gap-8 text-[#677279] dark:text-gray-400 text-[13px] font-medium">
            <span className="font-semibold">© {new Date().getFullYear()} PALshop Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
