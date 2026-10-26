"use client";

import React from "react";
import { CalendarCheck } from "lucide-react";
import { useBooking } from "../context/BookingContext";

export function BookNowCTAButton({ secondary = false }: { secondary?: boolean }) {
  const { openBookingModal } = useBooking();

  if (secondary) {
    return (
      <button
        onClick={() => openBookingModal()}
        className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-purple-50 text-purple-950 font-extrabold text-base shadow-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
      >
        <CalendarCheck className="w-5 h-5 text-purple-600 stroke-[2.5]" />
        <span>Book Your Event Now</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => openBookingModal()}
      className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-base shadow-xl shadow-purple-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
    >
      <CalendarCheck className="w-5 h-5 stroke-[2.5]" />
      <span>Book Now - Request Quote</span>
    </button>
  );
}

