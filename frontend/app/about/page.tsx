import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Users, Award, ShieldCheck, Music, CheckCircle2, ArrowRight } from "lucide-react";
import { getSiteData } from "@/lib/contentService";
import { TrustStats } from "../../components/TrustStats";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();
  return {
    title: `About Us | ${siteData.bandName}`,
    description: `Learn about ${siteData.bandName}'s musical journey, acoustic craftsmanship, sound engineering team, and commitment to event excellence.`,
  };
}

export default async function AboutPage() {
  const siteData = await getSiteData();
  const aboutImage = siteData.aboutImage || "/images/hero-cover.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-block p-2.5 bg-black rounded-2xl border border-amber-500/30 shadow-lg mx-auto">
          <Image
            src="/images/logo/logo.png"
            alt="Adab Live"
            width={160}
            height={96}
            className="h-16 w-auto object-contain mx-auto"
            priority
          />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider">
            <Music className="w-3.5 h-3.5 text-purple-600" />
            <span>Our Journey & Passion</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-display">About {siteData.bandName}</h1>
        <p className="text-lg text-purple-700 font-medium">Crafting Live Music Experiences & Precision Sound</p>
      </div>

      {/* Main Story & Photography Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <h2 className="text-3xl font-bold text-slate-900 font-display">Acoustic Excellence & Stage Vibrancy</h2>
          <p className="text-base text-slate-900 font-medium">{siteData.aboutText}</p>
          <p>
            We believe that live music is the beating heart of any great event. From soft acoustic arrangements during cocktail hours to high-energy party sets that keep the dance floor packed all night, our ensemble adapts seamlessly to your vision.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Dedicated sound checks before every performance</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Flexible setlists covering pop, jazz, rock, & acoustic classics</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Full equipment backup for 100% technical reliability</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <Image
            src={aboutImage}
            alt={`${siteData.bandName} band on stage`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl glass-panel bg-white/90 backdrop-blur-md border border-slate-200">
            <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Our Core Promise</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Authentic Live Music Without Compromise</div>
          </div>
        </div>
      </div>

      {/* Trust Stats */}
      <TrustStats />
    </div>
  );
}
