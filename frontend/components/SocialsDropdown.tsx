"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "./SocialIcons";
import siteData from "../data/site.json";

export function SocialsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [site, setSite] = useState(siteData);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    fetch("/api/admin/content?type=site")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setSite(json.data);
      })
      .catch(() => {});
  }, []);

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
        <span>Social Media</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-600" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 w-60 z-50">
          <div className="glass-dropdown bg-white border border-slate-200 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Instagram Link */}
            <a
              href={site.socials?.instagram || siteData.socials.instagram}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 hover:border-purple-500/30 border border-transparent transition-all group/item"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-purple-600/10 text-pink-600 group-hover/item:bg-gradient-to-tr group-hover/item:from-purple-600 group-hover/item:to-pink-500 group-hover/item:text-white transition-all">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 group-hover/item:text-purple-600">Instagram</div>
                  <div className="text-xs text-slate-500 mt-0.5">@adablive</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-purple-600 transition-colors" />
            </a>

            {/* YouTube Link */}
            <a
              href={site.socials?.youtube || siteData.socials.youtube}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 hover:border-purple-500/30 border border-transparent transition-all group/item mt-1"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-red-500/10 text-red-600 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors">
                  <YoutubeIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 group-hover/item:text-purple-600">YouTube</div>
                  <div className="text-xs text-slate-500 mt-0.5">@adablive</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-purple-600 transition-colors" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

