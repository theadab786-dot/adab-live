"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { BookingFormData } from "./BookingModal";
import { User, Phone, Mail, MessageSquare, ShieldCheck, CreditCard, CalendarX, AlertTriangle, Receipt } from "lucide-react";

export interface StepContactProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
}

export function StepContact({ register, errors }: StepContactProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 font-display">Step 5: Contact Information</h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Provide your contact details so the band owner can send your booking confirmation.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span>Full Name *</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            {...register("contact.name")}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
          />
          {errors.contact?.name && (
            <p className="text-xs text-red-500 mt-1">{errors.contact.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-purple-600" />
              <span>Phone / WhatsApp Number *</span>
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register("contact.phone")}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
            />
            {errors.contact?.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.contact.phone.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("contact.email")}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
            />
            {errors.contact?.email && (
              <p className="text-xs text-red-500 mt-1">{errors.contact.email.message}</p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>Special Requests / Song Preferences / Notes (Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Tell us about your event theme, song requests, or stage requirements..."
            {...register("contact.notes")}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Booking Terms & Conditions */}
        <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
          <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Booking Terms & Conditions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 30% Advance Payment */}
            <div className="p-3 rounded-xl bg-white border border-purple-200/60 shadow-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>30% Advance Payment</span>
              </div>
              <p className="text-slate-600 leading-snug">
                A 30% advance deposit is required to confirm your booking.
              </p>
            </div>

            {/* Cancellation Window */}
            <div className="p-3 rounded-xl bg-white border border-purple-200/60 shadow-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CalendarX className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Cancellation Window</span>
              </div>
              <p className="text-slate-600 leading-snug">
                Cancellations must be made at least 3 days prior to the event.
              </p>
            </div>

            {/* Last-Minute Cancellation Policy */}
            <div className="p-3 rounded-xl bg-white border border-purple-200/60 shadow-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Last-Minute Cancellation Policy</span>
              </div>
              <p className="text-slate-600 leading-snug">
                No refunds are provided for last-minute cancellations.
              </p>
            </div>

            {/* Remaining Balance */}
            <div className="p-3 rounded-xl bg-white border border-purple-200/60 shadow-xs space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Remaining Balance</span>
              </div>
              <p className="text-slate-600 leading-snug">
                The remaining balance amount is due after the sound check on the date of the event.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Quote Request Checkbox */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <input
            type="checkbox"
            id="customQuoteRequested"
            {...register("contact.customQuoteRequested")}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
          />
          <label htmlFor="customQuoteRequested" className="text-xs font-semibold text-slate-800 cursor-pointer">
            Request a custom quote for unlisted equipment or extended schedule requirements
          </label>
        </div>

        {/* Honeypot hidden input */}
        <input
          type="text"
          {...register("contact.hp")}
          className="hidden opacity-0 pointer-events-none w-0 h-0"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}


