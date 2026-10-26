"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Music, Users, ArrowRight, CalendarCheck } from "lucide-react";
import { useBooking } from "../context/BookingContext";

export interface LineupCardProps {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  members: { role: string; instrument: string }[];
  photos: string[];
  basePrice: number;
  priceNote: string;
}

export function LineupCard({
  slug,
  name,
  tagline,
  description,
  members,
  photos,
  basePrice,
  priceNote,
}: LineupCardProps) {
  const { openBookingModal } = useBooking();

  const primaryPhoto = photos && photos.length > 0 ? photos[0] : "/images/hero-cover.jpg";

  return (
    <div className="glass-panel bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:border-purple-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Photo Container */}
        <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-slate-100">
          <Image
            src={primaryPhoto}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top sm:object-[center_20%] group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-semibold shadow-xs">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>{(members || []).length} {(members || []).length === 1 ? "Musician" : "Musicians"}</span>
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white font-display shadow-xs">{name}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">{tagline}</p>
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{description}</p>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Musicians & Instruments:</h4>
            <div className="flex flex-wrap gap-1.5">
              {(members || []).map((m, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                  {m.role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="p-6 pt-0 space-y-3">
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting Fee</span>
            <span className="text-2xl font-extrabold text-purple-600">₹{basePrice ? basePrice.toLocaleString("en-IN") : "0"}</span>
          </div>

          <Link
            href={`/live-band/${slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-purple-600 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          onClick={() =>
            openBookingModal({
              serviceType: "live-band",
              presetLineupId: slug,
            })
          }
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Customize & Book {name}</span>
        </button>
      </div>
    </div>
  );
}

