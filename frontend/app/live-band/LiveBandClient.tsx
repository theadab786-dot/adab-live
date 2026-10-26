"use client";

import React, { useState } from "react";
import { Music, PlusCircle, Sparkles } from "lucide-react";
import { LineupCard } from "../../components/LineupCard";
import { useBooking } from "../../context/BookingContext";

interface LiveBandClientProps {
  lineups: any[];
  musicians: any[];
}

export function LiveBandClient({ lineups, musicians }: LiveBandClientProps) {
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const { openBookingModal } = useBooking();

  const filteredLineups = lineups.filter((l) => {
    if (sizeFilter === "solo") return l.members?.length === 1;
    if (sizeFilter === "duet") return l.members?.length === 2;
    if (sizeFilter === "fullband") return l.members?.length >= 4;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider">
          <Music className="w-3.5 h-3.5 text-purple-600" />
          <span>Live Formations & Custom Ensembles</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-display">Live Music Lineups</h1>
        <p className="text-slate-600 text-base leading-relaxed">
          From intimate solos for cocktail receptions to high-octane 5-piece concert bands for grand galas. Choose a preset lineup or build a custom band with individual musicians.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setSizeFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              sizeFilter === "all"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Formations ({lineups.length})
          </button>

          <button
            onClick={() => setSizeFilter("solo")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              sizeFilter === "solo"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Solo (1 Musician)
          </button>

          <button
            onClick={() => setSizeFilter("duet")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              sizeFilter === "duet"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Duet (2 Musicians)
          </button>

          <button
            onClick={() => setSizeFilter("fullband")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              sizeFilter === "fullband"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Five-Piece Band (5 Musicians)
          </button>
        </div>
      </div>

      {/* Preset Lineups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {filteredLineups.map((lineup) => (
          <LineupCard key={lineup.slug} {...lineup} />
        ))}
      </div>

      {/* Custom Musician Build-Your-Own Section */}
      <section className="glass-panel bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <PlusCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>Custom Ensemble Builder</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Need a Custom Instrument Setup?</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Select individual soloists or add guest instrumentalists (Saxophone, Violin, Drums, Keys) to build your unique live sound.
            </p>
          </div>

          <button
            onClick={() =>
              openBookingModal({
                serviceType: "live-band",
              })
            }
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Build Custom Band in Modal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {musicians.map((m) => (
            <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-900">{m.role}</div>
                <div className="text-[11px] text-slate-500">Add-on per event</div>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-purple-600">+₹{m.pricePerEvent.toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
