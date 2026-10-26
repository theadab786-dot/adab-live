"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryProps {
  photos: string[];
  title: string;
}

export function Gallery({ photos, title }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % photos.length);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-900 font-display">Photo Gallery</h3>

      {/* Grid of Photo Thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {photos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group shadow-xs hover:shadow-md transition-all"
          >
            <Image
              src={photo}
              alt={`${title} photo ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top sm:object-[center_20%] group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-3 rounded-full bg-white/90 backdrop-blur-md text-slate-900 shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-4xl h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={photos[selectedIndex]}
              alt={`${title} enlarged photo`}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-lg pointer-events-none">
            {selectedIndex + 1} of {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
