"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Music, Speaker } from "lucide-react";

export function NavDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>Product</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-600" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 w-64 z-50">
          <div className="glass-dropdown bg-white border border-slate-200 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="/live-band"
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 hover:border-purple-500/30 border border-transparent transition-all group/item"
            >
              <div className="p-2 rounded-md bg-purple-500/10 text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover/item:text-purple-600">Live Music Band</div>
                <div className="text-xs text-slate-500 mt-0.5">Solo, Duet & 5-Piece Band Lineups</div>
              </div>
            </Link>

            <Link
              href="/sound-setup"
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 hover:border-purple-500/30 border border-transparent transition-all group/item mt-1"
            >
              <div className="p-2 rounded-md bg-purple-500/10 text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                <Speaker className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 group-hover/item:text-purple-600">Sound Setup</div>
                <div className="text-xs text-slate-500 mt-0.5">PA Systems, Mics, Lights & Audio Engineers</div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

