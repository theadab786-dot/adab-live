import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Music, Users, CalendarCheck, CheckCircle2, ArrowLeft, ShieldCheck, Clock } from "lucide-react";
import { getLineupsData } from "@/lib/contentService";
import { Gallery } from "../../../components/Gallery";
import { BookNowButton } from "./BookNowButton";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lineups = await getLineupsData();
  const lineup = lineups.find((l: any) => l.slug === resolvedParams.slug);

  if (!lineup) {
    return { title: "Lineup Not Found | Adab Live" };
  }

  return {
    title: `${lineup.name} | Adab Live Music Lineup`,
    description: lineup.description,
    openGraph: {
      title: `${lineup.name} - ${lineup.tagline} | Adab Live`,
      description: lineup.description,
      images: lineup.photos?.[0] ? [{ url: lineup.photos[0] }] : [],
    },
  };
}

export default async function LineupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const lineups = await getLineupsData();
  const lineup = lineups.find((l: any) => l.slug === resolvedParams.slug);

  if (!lineup) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Link
        href="/live-band"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Lineups</span>
      </Link>

      <div className="glass-panel bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-10">
        {/* Lineup Banner Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Music className="w-3.5 h-3.5 text-purple-600" />
              <span>Lineup Showcase</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-display">{lineup.name}</h1>
            <p className="text-lg text-purple-600 font-medium mt-2">{lineup.tagline}</p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimated Base Fee</span>
            <span className="text-3xl font-extrabold text-purple-600">₹{lineup.basePrice?.toLocaleString("en-IN")}</span>
            <span className="text-xs text-slate-400 block">{lineup.priceNote}</span>
          </div>
        </div>

        {/* Gallery Section */}
        <Gallery photos={lineup.photos || []} title={lineup.name} />

        {/* Description & Musician Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="md:col-span-2 space-y-6 text-slate-600 leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-slate-900 font-display">About this Lineup</h3>
              <p className="text-slate-700 text-base leading-relaxed">{lineup.description}</p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-200/60 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Performance Specifications</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Standard set duration: 3 hours live music (with short intermission breaks)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Full backline stage instruments provided</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Custom song requests accepted with advance notice</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>On-site arrival 90 minutes before scheduled start time for setup & sound check</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-6 h-fit">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Musicians ({lineup.members?.length || 0})</span>
              </h3>
              <div className="space-y-3">
                {(lineup.members || []).map((member: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-sm font-semibold text-slate-900">{member.role}</div>
                    <div className="text-xs text-purple-600 font-medium">{member.instrument}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Guaranteed date reservation upon confirmation</span>
              </div>
              <BookNowButton slug={lineup.slug} name={lineup.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
