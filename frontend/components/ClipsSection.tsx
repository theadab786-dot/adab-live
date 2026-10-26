"use client";

import React, { useState } from "react";
import { Play, Tv, Sparkles } from "lucide-react";
import siteData from "../data/site.json";

interface ClipsSectionProps {
  clips?: Array<{
    id: string;
    title: string;
    type: string;
    embedUrl: string;
  }>;
}

export function ClipsSection({ clips }: ClipsSectionProps) {
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const displayClips = clips && clips.length > 0 ? clips : siteData.clips;

  return (
    <section className="space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Live Atmosphere</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">Watch Performance Clips</h2>
        <p className="text-slate-600 text-sm">
          Experience our stage presence, acoustic balance, and live energy recorded at real events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {displayClips.map((clip) => (
          <div
            key={clip.id}
            className="glass-panel bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Tv className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display line-clamp-1">{clip.title}</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {clip.type}
              </span>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner flex items-center justify-center">
              {activeClipId === clip.id ? (
                <iframe
                  src={`${clip.embedUrl}?autoplay=1`}
                  title={clip.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent opacity-60" />
                  <button
                    onClick={() => setActiveClipId(clip.id)}
                    className="relative z-10 w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-500/30 transition-transform transform hover:scale-110 active:scale-95 group"
                    aria-label={`Play clip ${clip.title}`}
                  >
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </button>
                  <p className="relative z-10 text-xs font-medium text-slate-300 mt-4">Click to play video clip</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

