"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music2, Menu, X, CalendarCheck, ExternalLink } from "lucide-react";
import { NavDropdown } from "./NavDropdown";
import { SocialsDropdown } from "./SocialsDropdown";
import { InstagramIcon, YoutubeIcon } from "./SocialIcons";
import { useBooking } from "../context/BookingContext";
import siteData from "../data/site.json";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [site, setSite] = useState(siteData);
  const pathname = usePathname();
  const { openBookingModal } = useBooking();

  React.useEffect(() => {
    fetch("/api/admin/content?type=site")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setSite(json.data);
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/product", label: "Product Overview" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 backdrop-blur-xl bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl bg-black border border-amber-500/30 flex items-center justify-center shadow-md shadow-black/15 group-hover:border-amber-400 group-hover:scale-105 transition-all overflow-hidden p-1 shrink-0">
            <Image
              src="/images/logo/logo-icon.png"
              alt="Adab Live"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors font-display">
                ADAB
              </span>
              <span className="text-xl font-bold tracking-wider text-amber-600 font-display">
                LIVE
              </span>
            </div>
            <span className="block text-[9.5px] text-slate-500 font-medium tracking-wider uppercase font-sans">
              LIVE MUSIC • EVENTS • ENTERTAINMENT
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/" ? "text-purple-600 font-bold" : "text-slate-600 hover:text-purple-600"
            }`}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/about" ? "text-purple-600 font-bold" : "text-slate-600 hover:text-purple-600"
            }`}
          >
            About
          </Link>

          {/* Product Dropdown */}
          <NavDropdown />

          {/* Social Media Dropdown */}
          <SocialsDropdown />

          <Link
            href="/contact"
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/contact" ? "text-purple-600 font-bold" : "text-slate-600 hover:text-purple-600"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openBookingModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold px-5 py-2.5 rounded-full text-sm shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Book Now</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-dropdown border-b border-purple-500/20 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                pathname === link.href ? "bg-purple-500/10 text-purple-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="text-xs uppercase text-purple-700 px-4 font-semibold tracking-wider">Services</div>
            <Link
              href="/live-band"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm text-slate-600 hover:text-purple-600"
            >
              • Live Music Band
            </Link>
            <Link
              href="/sound-setup"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm text-slate-600 hover:text-purple-600"
            >
              • Sound Setup & Audio Engineering
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div className="text-xs uppercase text-purple-700 px-4 font-semibold tracking-wider">Social Media</div>
            <a
              href={site.socials?.instagram || siteData.socials.instagram}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-sm text-slate-600 hover:text-purple-600"
            >
              <span className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <span>Instagram</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href={site.socials?.youtube || siteData.socials.youtube}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-sm text-slate-600 hover:text-purple-600"
            >
              <span className="flex items-center gap-2">
                <YoutubeIcon className="w-4 h-4 text-red-600" />
                <span>YouTube</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}


