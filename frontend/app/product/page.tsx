import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Music, Speaker, ArrowRight } from "lucide-react";
import { getLineupsData, getSoundData, getSiteData } from "@/lib/contentService";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();
  return {
    title: `Bookable Offerings Overview | ${siteData.bandName}`,
    description: `Browse ${siteData.bandName}'s complete catalog of live band lineups (solos, duets, five-piece band) and professional PA sound equipment packages.`,
  };
}

export default async function ProductOverviewPage() {
  const [lineups, soundCatalog] = await Promise.all([
    getLineupsData(),
    getSoundData(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-display">Bookable Offerings</h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Browse our live musical band lineups and professional acoustic sound packages. Select items individually or combine both in a single booking request.
        </p>
      </div>

      {/* Live Band Overview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-slate-900 font-display">Live Band Lineups</h2>
          </div>
          <Link href="/live-band" className="text-sm font-semibold text-purple-600 hover:underline flex items-center gap-1">
            <span>View All Lineups</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {lineups.map((lineup: any) => (
            <div key={lineup.slug} className="glass-panel bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:border-purple-500/40 flex flex-col justify-between space-y-4 transition-all">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">{lineup.name}</h3>
                <p className="text-xs text-purple-600 font-medium mt-1">{lineup.tagline}</p>
                <p className="text-slate-600 text-xs mt-3 line-clamp-3 leading-relaxed">{lineup.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting From</span>
                  <span className="text-lg font-bold text-purple-600">₹{lineup.basePrice?.toLocaleString("en-IN")}</span>
                </div>
                <Link
                  href={`/live-band/${lineup.slug}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-700 hover:bg-purple-600 hover:text-white transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sound Equipment Overview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <Speaker className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">Sound Setup Packages</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                From 20–40+ person setups to 250+ open-area concert stages. Complete with dedicated operators and full cabling.
              </p>
            </div>
          </div>
          <Link href="/sound-setup" className="text-sm font-semibold text-purple-600 hover:underline flex items-center gap-1 shrink-0">
            <span>View All Sound Equipment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {soundCatalog.slice(0, 3).map((item: any) => (
            <div key={item.id} className="glass-panel bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:border-purple-500/40 flex flex-col justify-between space-y-4 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    {item.setupNumber ? `Setup ${item.setupNumber}` : item.category}
                  </span>
                  {item.crowdCapacity && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.crowdCapacity}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display mt-2">{item.name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">{item.description}</p>

                {item.operators && (
                  <div className="text-[11px] font-semibold text-blue-700 bg-blue-50/70 px-2 py-1 rounded-md border border-blue-100 inline-block">
                    {item.operators} • Full wiring provided
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Price Range
                  </span>
                  <span className="text-base font-extrabold text-purple-700 font-display">
                    {item.priceRange || `₹${item.price?.toLocaleString("en-IN")}`}
                  </span>
                  {item.priceDisplay && (
                    <span className="text-[10px] text-slate-400 block">
                      ({item.priceDisplay})
                    </span>
                  )}
                </div>
                <Link
                  href="/sound-setup"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-purple-600 hover:text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
