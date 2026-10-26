"use client";

import React, { useState } from "react";
import { Music, Users, PlusCircle, CheckCircle2 } from "lucide-react";
import lineups from "../../data/lineups.json";
import musicians from "../../data/musicians.json";

export interface StepBandProps {
  presetLineupId?: string;
  customMusicianIds: string[];
  onSelectPreset: (slug: string) => void;
  onToggleCustomMusician: (id: string) => void;
  onClearBandSelection: () => void;
}

export function StepBand({
  presetLineupId,
  customMusicianIds,
  onSelectPreset,
  onToggleCustomMusician,
}: StepBandProps) {
  const [mode, setMode] = useState<"preset" | "custom">(
    customMusicianIds.length > 0 && !presetLineupId ? "custom" : "preset"
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 font-display">Step 2: Live Band Options</h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Choose a preset ensemble or build a custom lineup of individual musicians.
        </p>

        {/* Mode Toggle Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 mt-4">
          <button
            type="button"
            onClick={() => setMode("preset")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "preset"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Preset Formations ({lineups.length})
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "custom"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Custom Musician Pick
          </button>
        </div>
      </div>

      {mode === "preset" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lineups.map((lineup) => {
            const isSelected = presetLineupId === lineup.slug && customMusicianIds.length === 0;
            return (
              <div
                key={lineup.slug}
                onClick={() => onSelectPreset(lineup.slug)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-purple-50/80 border-purple-500 shadow-md shadow-purple-500/10"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900 font-display">{lineup.name}</span>
                    <span className="text-xs font-bold text-purple-600">₹{lineup.basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1 line-clamp-2">{lineup.tagline}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {lineup.members.length} {lineup.members.length === 1 ? "Musician" : "Musicians"}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-purple-600 bg-purple-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Select individual musicians to create your tailored band setup:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {musicians.map((m) => {
              const isSelected = customMusicianIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => onToggleCustomMusician(m.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-purple-50/80 border-purple-500 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{m.role}</div>
                    <div className="text-[11px] text-purple-600 font-semibold">+₹{m.pricePerEvent.toLocaleString("en-IN")}</div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-purple-600 bg-purple-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

