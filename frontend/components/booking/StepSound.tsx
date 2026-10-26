"use client";

import React from "react";
import { Speaker, CheckCircle2, Wrench, Users, UserCheck, Zap, Sparkles } from "lucide-react";
import soundCatalog from "../../data/sound.json";

export interface StepSoundProps {
  soundPackageId?: string;
  soundAddonIds: string[];
  onSelectPackage: (id: string) => void;
  onToggleAddon: (id: string) => void;
}

export function StepSound({
  soundPackageId,
  soundAddonIds,
  onSelectPackage,
  onToggleAddon,
}: StepSoundProps) {
  const paPackages = soundCatalog.filter(
    (s) => s.category.toLowerCase() === "package" || s.category.toLowerCase() === "speakers"
  );
  const addons = soundCatalog.filter(
    (s) => s.category.toLowerCase() === "addon" || s.category.toLowerCase() !== "speakers"
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 font-display">Step 3: Sound & Stage Setup</h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Choose a primary sound setup package based on your crowd size and add optional extra equipment.
        </p>
      </div>

      {/* PA Packages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Select Primary Sound Setup:
          </h4>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            All wire connectivity provided by sound men
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {paPackages.map((pkg: any) => {
            const isSelected = soundPackageId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => onSelectPackage(pkg.id)}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-purple-50/90 border-purple-600 shadow-md shadow-purple-500/10 ring-1 ring-purple-600"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                }`}
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-slate-900 font-display">
                        {pkg.name}
                      </span>
                      {pkg.setupNumber && (
                        <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full">
                          Setup {pkg.setupNumber}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-extrabold text-purple-700 font-display">
                        {pkg.priceRange || `₹${pkg.price.toLocaleString("en-IN")}`}
                      </span>
                      {pkg.priceDisplay && (
                        <span className="text-[10px] text-slate-400 block font-normal">
                          ({pkg.priceDisplay})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Highlights pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2.5">
                    {pkg.crowdCapacity && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        <Users className="w-3 h-3 text-purple-600" />
                        <span>{pkg.crowdCapacity}</span>
                      </span>
                    )}

                    {pkg.operators && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        <UserCheck className="w-3 h-3 text-blue-600" />
                        <span>{pkg.operators}</span>
                      </span>
                    )}

                    {pkg.soundBrands && pkg.soundBrands.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-900 bg-purple-100/80 px-2 py-0.5 rounded-md">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>{pkg.soundBrands.join(" • ")}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">{pkg.description}</p>

                  {/* Key inclusions */}
                  {pkg.features && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-3 text-[11px] text-slate-700">
                      {pkg.features.slice(0, 4).map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-purple-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    {isSelected ? "Selected setup package" : "Click to select this setup"}
                  </span>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-slate-300"
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

      {/* Audio & Stage Add-ons */}
      <div className="space-y-3 pt-2">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Additional Items / Customization Add-ons:
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            You can add extra mics, extra speakers, or extra bass to customize your audio setup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {addons.map((addon: any) => {
            const isSelected = soundAddonIds.includes(addon.id);
            return (
              <div
                key={addon.id}
                onClick={() => onToggleAddon(addon.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? "bg-purple-50/90 border-purple-600 shadow-xs ring-1 ring-purple-600"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">{addon.name}</span>
                    <span className="text-xs font-extrabold text-purple-700">
                      {addon.priceDisplay || `+₹${addon.price}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                    {addon.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    {isSelected ? "Added" : "Add to setup"}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
