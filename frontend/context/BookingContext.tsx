"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ServiceType } from "@/lib/schemas";

interface BookingPreselectOptions {
  serviceType?: ServiceType;
  presetLineupId?: string;
  soundPackageId?: string;
}

interface BookingContextType {
  isOpen: boolean;
  openBookingModal: (options?: BookingPreselectOptions) => void;
  closeBookingModal: () => void;
  preselect: BookingPreselectOptions;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselect, setPreselect] = useState<BookingPreselectOptions>({});

  const openBookingModal = (options?: BookingPreselectOptions) => {
    if (options) {
      setPreselect(options);
    } else {
      setPreselect({});
    }
    setIsOpen(true);
  };

  const closeBookingModal = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider value={{ isOpen, openBookingModal, closeBookingModal, preselect }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
