"use client";

import React from "react";
import Image from "next/image";
import {
  Speaker,
  Mic,
  Users,
  UserCheck,
  CheckCircle2,
  CalendarCheck,
  Zap,
  Radio,
  Sliders,
  Sun,
  Layers,
  Sparkles,
} from "lucide-react";
import { useBooking } from "../context/BookingContext";

export interface SoundCardProps {
  id: string;
  name: string;
  setupNumber?: string;
  shortName?: string;
  tagline?: string;
  description: string;
  photos: string[];
  price: number;
  priceRange?: string;
  priceDisplay?: string;
  category: string;
  badge?: string;
  crowdCapacity?: string;
  operators?: string;
  speakers?: string;
  monitors?: string;
  bass?: string;
  mics?: string;
  cabling?: string;
  lighting?: string;
  soundBrands?: string[];
  features?: string[];
  additionalItems?: string[];
  additionalItemsNote?: string;
}

export function SoundCard({
  id,
  name,
  setupNumber,
  shortName,
  tagline,
  description,
  photos,
  price,
  priceRange,
  priceDisplay,
  category,
  badge,
  crowdCapacity,
  operators,
  speakers,
  monitors,
  bass,
  mics,
  cabling,
  lighting,
  soundBrands,
  features,
  additionalItems,
  additionalItemsNote,
}: SoundCardProps) {
  const { openBookingModal } = useBooking();

  const isPackage = category === "package" || category === "speakers";
  const primaryPhoto = photos && photos.length > 0 ? photos[0] : "/images/hero-cover.jpg";

  return (
    <div className="glass-panel bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Photo Header */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
          <Image
            src={primaryPhoto}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 text-[11px] font-bold uppercase tracking-wider shadow-xs">
              {isPackage ? (
                <>
                  <Speaker className="w-3.5 h-3.5 text-purple-600" />
                  <span>{setupNumber ? `Setup ${setupNumber}` : "Setup"}</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Add-on Item</span>
                </>
              )}
            </span>

            {crowdCapacity && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/85 backdrop-blur-md border border-purple-500/30 text-purple-200 text-[11px] font-semibold">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>{crowdCapacity}</span>
              </span>
            )}
          </div>

          {/* Bottom Title inside thumbnail */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold font-display leading-tight">{name}</h3>
            </div>
            {tagline && <p className="text-xs text-slate-200/90 font-medium line-clamp-1 mt-0.5">{tagline}</p>}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{description}</p>

          {/* Inclusions Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {operators && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{operators}</span>
              </span>
            )}

            {cabling && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Wire connectivity provided</span>
              </span>
            )}
          </div>

          {/* Sound Brands (for Classic Setup) */}
          {soundBrands && soundBrands.length > 0 && (
            <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                Supported Sound Brands:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {soundBrands.map((brand) => (
                  <span
                    key={brand}
                    className="px-2 py-0.5 bg-white text-purple-900 rounded-md border border-purple-200 text-xs font-extrabold tracking-wide shadow-2xs"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features / Spec List */}
          {features && features.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Equipment & Crew Inclusions:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Items callout for Basic Setup */}
          {additionalItems && additionalItems.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-amber-800">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Available Add-on Options:</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Need more power? We can add in:{" "}
                <span className="font-semibold">{additionalItems.join(" • ")}</span>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer & CTA */}
      <div className="p-6 pt-0 space-y-3">
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {priceRange ? "Price Range" : "Estimated Price"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-purple-700 font-display">
                {priceRange || (price ? `₹${price.toLocaleString("en-IN")}` : "Contact for Quote")}
              </span>
            </div>
            {priceDisplay && (
              <span className="text-[11px] font-medium text-slate-500 block">
                ({priceDisplay})
              </span>
            )}
          </div>

          <button
            onClick={() =>
              openBookingModal({
                serviceType: "sound-setup",
                soundPackageId: id,
              })
            }
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Setup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
