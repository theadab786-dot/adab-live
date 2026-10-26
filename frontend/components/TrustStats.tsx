import React from "react";
import { Award, ShieldCheck, Clock, Star, Zap } from "lucide-react";

export function TrustStats() {
  return (
    <section className="glass-panel bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
        <div className="space-y-2 p-2">
          <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 font-display">150+</div>
          <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Events Performed</div>
        </div>

        <div className="space-y-2 p-2 pt-6 md:pt-2">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display flex items-center justify-center gap-1">
            <span>4.9</span>
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Client Rating</div>
        </div>

        <div className="space-y-2 p-2 pt-6 md:pt-2">
          <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 font-display">100%</div>
          <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Sound Guarantee</div>
        </div>

        <div className="space-y-2 p-2 pt-6 md:pt-2">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">Instant</div>
          <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Estimate Quotes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">Professional Musicians</h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              Experienced session vocalists and instrumentalists dedicated to captivating your guests.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">High-Fidelity PA Sound</h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              Top-tier sound systems tuned specifically for venue acoustics and non-fatiguing ear comfort.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">Transparent Booking</h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              No hidden fees. Upfront estimate calculation with personal confirmation from the band owner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

