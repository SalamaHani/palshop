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
    <footer className="bg-white mt-20 md:mb-15 dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.jpeg"
                alt="Logo"
                width={150}
                height={1}
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your trusted Palestinian marketplace for authentic products and
              handcrafted treasures.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-[#215732] dark:hover:bg-[#34d399] hover:text-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-[#215732] dark:hover:bg-[#34d399] hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-[#215732] dark:hover:bg-[#34d399] hover:text-white transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#215732] dark:hover:text-[#34d399] transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#215732] dark:hover:text-[#34d399] transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#215732] dark:hover:text-[#34d399] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#215732] dark:hover:text-[#34d399] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#215732] dark:hover:text-[#34d399] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#215732] dark:hover:text-[#34d399] transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#215732] dark:hover:text-[#34d399] transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-[#215732] dark:hover:text-[#34d399] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#215732] dark:text-[#34d399]" />
                <span className="text-sm">Palestine, Ramallah</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#215732] dark:text-[#34d399]" />
                <span className="text-sm">+970 xx xxx xxxx</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#215732] dark:text-[#34d399]" />
                <span className="text-sm">info@palshop.app</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} PALshop. All rights reserved. Made with
            ❤️ in Palestine
          </p>
        </div>
      </div>
    </footer>
  );
}
