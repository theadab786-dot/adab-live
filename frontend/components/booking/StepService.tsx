"use client";

import React from "react";
import { Music, Speaker, Sparkles, CheckCircle2 } from "lucide-react";
import { ServiceType } from "@/lib/schemas";

export interface StepServiceProps {
  selectedService: ServiceType;
  onSelectService: (service: ServiceType) => void;
}

export function StepService({ selectedService, onSelectService }: StepServiceProps) {
  const options: { id: ServiceType; title: string; subtitle: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "live-band",
      title: "Live Music Band",
      subtitle: "Book solo, duet, or 5-piece live band lineups for your event.",
      icon: <Music className="w-6 h-6 text-purple-600" />,
    },
    {
      id: "sound-setup",
      title: "Sound Setup & Engineering",
      subtitle: "PA speakers, subwoofers, wireless mics, digital mixer console & on-site audio engineer.",
      icon: <Speaker className="w-6 h-6 text-purple-600" />,
    },
    {
      id: "both",
      title: "Full Production Package (Band + Sound)",
      subtitle: "Complete end-to-end live performance with full stage PA sound setup & audio engineering.",
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      badge: "Most Popular",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 font-display">Step 1: Choose Service</h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Select what you would like to book for your upcoming event.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((opt) => {
          const isSelected = selectedService === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onSelectService(opt.id)}
              className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                isSelected
                  ? "bg-purple-50/80 border-purple-500 shadow-md shadow-purple-500/10"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  isSelected ? "bg-purple-600 text-white" : "bg-slate-100 text-purple-600"
                }`}
              >
                {opt.icon}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900 font-display">{opt.title}</span>
                  {opt.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-600 text-white">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{opt.subtitle}</p>
              </div>

              <div className="shrink-0 pt-0.5">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? "border-purple-600 bg-purple-600 text-white" : "border-slate-300"
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

