"use client";

import React, { useState } from "react";
import {
  Speaker,
  Mic,
  Sliders,
  Sun,
  Wrench,
  CalendarCheck,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  Sparkles,
  Layers,
  Flame,
  Radio,
  ArrowRight,
} from "lucide-react";
import { SoundCard } from "../../components/SoundCard";
import { useBooking } from "../../context/BookingContext";

interface SoundSetupClientProps {
  soundCatalog: any[];
}

export function SoundSetupClient({ soundCatalog }: SoundSetupClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { openBookingModal } = useBooking();

  const packages = soundCatalog.filter((item) => item.category === "package");
  const addons = soundCatalog.filter((item) => item.category === "addon");

  const filteredItems = soundCatalog.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "packages") return item.category === "package";
    if (activeFilter === "addons") return item.category === "addon";
    if (activeFilter === "basic") return item.id === "basic-setup";
    if (activeFilter === "setup-2") return item.id === "setup-2";
    if (activeFilter === "classic") return item.id === "classic-setup";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero Header */}
      <div className="text-center space-y-5 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider shadow-xs">
          <Speaker className="w-4 h-4 text-purple-600" />
          <span>Professional Live Audio & Stage Engineering</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.1]">
          Sound Setups & Stage Production
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          Tailored sound setups for every crowd size — from intimate 20–40+ guest gatherings to grand 250+ outdoor concerts. Complete with 15″ to 35″ speakers, line arrays, cordless mics, stage monitors, subwoofers, moving-head lighting, and dedicated on-site sound and light operators. All wire connectivity is provided by our sound crew.
        </p>

        {/* Brand Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">
            Engineered with industry-standard audio:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold">
              ORIGINAL
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold">
              DNB (d&b audiotechnik)
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold">
              JBL Professional
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-bold">
              RCF Audio
            </span>
          </div>
        </div>

        {/* Category / Setup Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === "all"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Equipment & Setups ({soundCatalog.length})
          </button>

          <button
            onClick={() => setActiveFilter("basic")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === "basic"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            1. Basic Setup (20–40+ Pax)
          </button>

          <button
            onClick={() => setActiveFilter("setup-2")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === "setup-2"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            2. Setup 2 (Pro Stage)
          </button>

          <button
            onClick={() => setActiveFilter("classic")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === "classic"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Classic Setup (80–250 Pax & Open)
          </button>

          <button
            onClick={() => setActiveFilter("addons")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === "addons"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Additional Add-on Items ({addons.length})
          </button>
        </div>
      </div>

      {/* Primary Setup Packages Cards Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              {activeFilter === "addons"
                ? "Additional Add-on Equipment"
                : activeFilter === "basic"
                ? "Setup 1: Basic Audio Package"
                : activeFilter === "setup-2"
                ? "Setup 2: Pro Stage Package"
                : activeFilter === "classic"
                ? "Classic Setup: Concert & Stage Production"
                : "Audio & Stage Setup Packages"}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {activeFilter === "addons"
                ? "Extra equipment available to enhance and expand your primary sound setup."
                : "Choose your setup based on gathering size, venue type, and live music requirements."}
            </p>
          </div>

          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 hidden sm:inline-block">
            {filteredItems.length} Option{filteredItems.length !== 1 ? "s" : ""} Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <SoundCard key={item.id} {...(item as any)} />
          ))}
        </div>
      </section>

      {/* Additional Items Spotlight Section (if not already filtered to addons) */}
      {activeFilter !== "addons" && (
        <section className="glass-panel bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Customization Add-ons</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Additional Items Available for Setups
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                You can easily add extra microphones, extra speakers, or extra bass subwoofers into the Basic Setup.
              </p>
            </div>

            <button
              onClick={() => setActiveFilter("addons")}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 shrink-0"
            >
              <span>View All Add-ons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 hover:bg-white transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-display text-base">
                      {addon.name}
                    </span>
                    <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                      {addon.priceDisplay || `+₹${addon.price}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{addon.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Adds to Basic Setup</span>
                  </span>

                  <button
                    onClick={() =>
                      openBookingModal({
                        serviceType: "sound-setup",
                        soundPackageId: "basic-setup",
                      })
                    }
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    Select in Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comprehensive Side-by-Side Comparison Matrix */}
      <section className="glass-panel bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Side-by-Side Breakdown</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Compare Sound Setup Packages
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Everything you need to know about our 3 audio setups at a glance.
          </p>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Specifications & Inclusions
                </th>
                <th className="p-4 font-bold text-slate-900 font-display text-base">
                  <div>1. Basic Setup</div>
                  <span className="text-xs text-purple-700 font-normal block font-sans">
                    ₹10,000 – ₹15,000 (10k to 15k)
                  </span>
                </th>
                <th className="p-4 font-bold text-slate-900 font-display text-base">
                  <div>2. Setup 2</div>
                  <span className="text-xs text-purple-700 font-normal block font-sans">
                    ₹20,000 – ₹35,000 (20k to 35k)
                  </span>
                </th>
                <th className="p-4 font-bold text-slate-900 font-display text-base bg-purple-50/50">
                  <div className="flex items-center gap-1.5">
                    <span>Classic Setup</span>
                    <span className="text-[10px] uppercase font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full font-sans">
                      Arena
                    </span>
                  </div>
                  <span className="text-xs text-purple-700 font-normal block font-sans">
                    ₹50,000 – ₹2,00,000 (50k to 2 Lakh)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  Recommended Gathering / Capacity
                </td>
                <td className="p-4">20 to 40+ people gathering</td>
                <td className="p-4">Mid-sized gatherings & stage events</td>
                <td className="p-4 font-semibold text-purple-900 bg-purple-50/30">
                  80 to 250 gathering and open areas
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  Loudspeakers & Line Arrays
                </td>
                <td className="p-4">2/4 × 15″ JBL Powered Speakers</td>
                <td className="p-4">2/4 × JBL / RCF 35″ Speakers</td>
                <td className="p-4 bg-purple-50/30">
                  6/8 Liners (Line Arrays) + 2/4 Tops (35″)
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  Side Fills
                </td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 font-medium text-slate-900 bg-purple-50/30">
                  2 × 30″ Side Fills
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  Stage Floor Monitors
                </td>
                <td className="p-4 text-slate-400">Optional add-on</td>
                <td className="p-4">2/4 × 15″ Monitors</td>
                <td className="p-4 bg-purple-50/30">4/6 × 15″ Monitors</td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  Subwoofers / Bass
                </td>
                <td className="p-4">
                  <span className="text-amber-700 font-medium">Extra Bass add-on available</span>
                </td>
                <td className="p-4 font-medium text-slate-900">2 Dedicated Bass</td>
                <td className="p-4 font-medium text-purple-900 bg-purple-50/30">
                  Concert Bass Subwoofers Integrated
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  Microphones
                </td>
                <td className="p-4">2 Cordless / Wireless Mics</td>
                <td className="p-4">
                  Mics provided according to artists & instruments
                </td>
                <td className="p-4 bg-purple-50/30">
                  Mics provided according to the band
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  Stage Lighting & Rigging
                </td>
                <td className="p-4 text-slate-400">—</td>
                <td className="p-4 text-slate-400">Available on request</td>
                <td className="p-4 font-medium text-slate-900 bg-purple-50/30">
                  4/8 Sharpi Lights + 8/16 LED Lights (Tripod Left/Right) + 1 Truss Road
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  On-Site Sound & Light Crew
                </td>
                <td className="p-4">1 Dedicated Sound Operator</td>
                <td className="p-4">2 Sound Operators</td>
                <td className="p-4 font-bold text-purple-900 bg-purple-50/30">
                  5/7 Sound and Light Operators
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  Wire Connectivity & Cabling
                </td>
                <td className="p-4 text-emerald-700 font-semibold">
                  All wire connectivity sound men will provide
                </td>
                <td className="p-4 text-emerald-700 font-semibold">
                  All wires & patch cables provided by sound men
                </td>
                <td className="p-4 text-emerald-700 font-semibold bg-purple-50/30">
                  Full concert wire snakes & power distribution provided
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-900 bg-slate-50/50">
                  Audio Brand Options
                </td>
                <td className="p-4 font-medium">JBL Professional</td>
                <td className="p-4 font-medium">JBL / RCF</td>
                <td className="p-4 font-bold text-purple-900 bg-purple-50/30">
                  ORIGINAL • DNB • JBL • RCF
                </td>
              </tr>

              <tr className="bg-slate-50/60">
                <td className="p-4 font-bold text-slate-900">Price Range</td>
                <td className="p-4 font-extrabold text-purple-700 font-display text-base">
                  ₹10,000 – ₹15,000
                </td>
                <td className="p-4 font-extrabold text-purple-700 font-display text-base">
                  ₹20,000 – ₹35,000
                </td>
                <td className="p-4 font-extrabold text-purple-700 font-display text-base bg-purple-100/50">
                  ₹50,000 – ₹2,00,000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* The Sound Men & Technical Crew Guarantee */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            All Wire Connectivity Included
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Never worry about cables or connections. Our sound men supply all power cables, audio snakes, XLR interconnects, DI boxes, and instrument patch leads.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Custom Mics for Artists & Instruments
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Microphone channels, dynamic frequency receivers, and instrument DI lines are allocated strictly according to your band lineup, performers, and instruments.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            On-Site Sound & Light Operators
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            From sound check through the final applause, our certified audio technicians and lighting operators remain at the console ensuring balanced sound and zero feedback.
          </p>
        </div>
      </section>

      {/* Technical Guarantee & CTA Banner */}
      <section className="glass-panel bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              <span>Full Transportation & On-Site Setup</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Ready to Book Your Sound Setup?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Select any sound setup individually or bundle it with our live band lineups for complete entertainment.
            </p>
          </div>

          <button
            onClick={() =>
              openBookingModal({
                serviceType: "sound-setup",
                soundPackageId: "basic-setup",
              })
            }
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 shrink-0 transition-all transform active:scale-95"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Customize Sound Setup Now</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
            <span>Acoustic tuning tailored to indoor & outdoor open grounds</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
            <span>Original, DNB, JBL, and RCF premium sound systems</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
            <span>1 to 7 dedicated sound & light operators on-site throughout</span>
          </div>
        </div>
      </section>
    </div>
  );
}
