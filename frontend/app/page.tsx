import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Music, Speaker, Sparkles, ArrowRight, CalendarCheck, CheckCircle2 } from "lucide-react";
import { getSiteData, getLineupsData, getSoundData } from "@/lib/contentService";
import { LineupCard } from "../components/LineupCard";
import { SoundCard } from "../components/SoundCard";
import { ClipsSection } from "../components/ClipsSection";
import { TrustStats } from "../components/TrustStats";
import { BookNowCTAButton } from "./BookNowCTAButton";

export const revalidate = 60;

export default async function HomePage() {
  const [siteData, lineupsData, soundData] = await Promise.all([
    getSiteData(),
    getLineupsData(),
    getSoundData(),
  ]);

  const heroImage = siteData.heroImage || "/images/hero-cover.jpg";

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-12 px-4 overflow-hidden">
        {/* Background Image overlay with smooth lighting gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Adab Live stage performance"
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/90 border border-amber-500/30 text-amber-300 text-xs font-medium uppercase tracking-widest shadow-lg shadow-black/10 animate-fade-in">
            <Image
              src="/images/logo/logo-icon.png"
              alt="Adab Live"
              width={20}
              height={20}
              className="rounded-full object-contain"
            />
            <span>Live Music • Events • Entertainment</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.1]">
            Unforgettable Stage Energy & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600">Flawless Sound</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
            {siteData.tagline}. Booking customized acoustic soloists, live gala bands, and high-fidelity PA sound systems for your special event.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <BookNowCTAButton />

            <Link
              href="/product"
              className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base flex items-center justify-center gap-3 border border-slate-200 hover:border-purple-500/40 shadow-sm transition-all"
            >
              <span>Explore All Offerings</span>
              <ArrowRight className="w-5 h-5 text-purple-600" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Zero Booking Fee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Live Estimate Calculator</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Confirmed Availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustStats />
      </section>

      {/* Featured Lineups Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">
              <Music className="w-4 h-4" />
              <span>Musical Lineups</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">Featured Live Formations</h2>
          </div>

          <Link
            href="/live-band"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
          >
            <span>View All Lineups</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {lineupsData.map((lineup: any) => (
            <LineupCard key={lineup.slug} {...lineup} />
          ))}
        </div>
      </section>

      {/* Sound Setup Teaser Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">
              <Speaker className="w-4 h-4" />
              <span>Audio & Stage Production</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">Sound Setup Packages</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              From 20–40+ guest gatherings to 250+ open-area concerts. Complete with sound operators and all wire connectivity included.
            </p>
          </div>

          <Link
            href="/sound-setup"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors shrink-0"
          >
            <span>Explore All Setups & Specs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {soundData.slice(0, 3).map((soundItem: any) => (
            <SoundCard key={soundItem.id} {...soundItem} />
          ))}
        </div>
      </section>

      {/* Performance Clips Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClipsSection clips={siteData.clips} />
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 border border-purple-500/30">
          <div className="space-y-3 max-w-2xl relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Ready to elevate your event with live music?
            </h2>
            <p className="text-purple-100 text-sm sm:text-base font-medium">
              Create a custom quote request in under a minute. Live band lineups, sound setups, or both combined.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <BookNowCTAButton secondary />
          </div>
        </div>
      </section>
    </div>
  );
}
