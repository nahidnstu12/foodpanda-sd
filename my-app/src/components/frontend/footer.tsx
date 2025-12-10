import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              <span className="text-[#06C167]">Food</span>
              <span className="text-white">Hub</span>
            </div>
            <p className="text-[#9CA3AF] text-sm">
              Your favorite food, delivered fast! Order from the best restaurants in Bangladesh.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-[#9CA3AF] hover:text-[#06C167] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-[#9CA3AF] hover:text-[#06C167] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-[#9CA3AF] hover:text-[#06C167] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* For Restaurants Column */}
          <div>
            <h3 className="font-semibold mb-4 text-white">For Restaurants</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/partner" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  Partner with us
                </Link>
              </li>
              <li>
                <Link href="/partner/app" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  Partner App
                </Link>
              </li>
              <li>
                <Link href="/partner/login" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  Restaurant Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <a href="tel:+8801234567890" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  +880 1234-567890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#9CA3AF]">
              © 2024 FoodHub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-[#9CA3AF] hover:text-[#06C167] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}