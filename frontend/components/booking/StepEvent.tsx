"use client";

import React, { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { BookingFormData } from "./BookingModal";
import { Calendar, Clock, MapPin, Users, Building, Tag, AlertCircle } from "lucide-react";

export interface StepEventProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  watch?: UseFormWatch<BookingFormData>;
  setValue?: UseFormSetValue<BookingFormData>;
}

const standardEventTypes = [
  "Wedding Reception",
  "Wedding Ceremony & Cocktail",
  "Corporate Gala",
  "Private Dinner / Party",
  "Birthday Celebration",
  "Festival / Public Concert",
];

const OTHER_OPTION = "Other Special Event";

export function StepEvent({ register, errors, watch, setValue }: StepEventProps) {
  const currentEventType = watch ? watch("event.eventType") || "" : "";

  const isStandard = standardEventTypes.includes(currentEventType);
  const isOtherSelected =
    currentEventType === OTHER_OPTION ||
    currentEventType.startsWith("Other: ") ||
    (!isStandard && currentEventType !== "");

  const selectedDropdownValue = isStandard ? currentEventType : OTHER_OPTION;

  const extractCustomText = (val: string) => {
    if (standardEventTypes.includes(val) || val === OTHER_OPTION) return "";
    if (val.startsWith("Other: ")) return val.replace(/^Other:\s*/, "");
    return val;
  };

  const [prevEventType, setPrevEventType] = useState(currentEventType);
  const [customText, setCustomText] = useState(() => extractCustomText(currentEventType));
  const [blockedDates, setBlockedDates] = useState<{ date: string; reason: string }[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/blocked-dates")
      .then((r) => r.json())
      .then((data) => {
        if (isMounted && Array.isArray(data?.blockedDates)) {
          setBlockedDates(data.blockedDates);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedDate = watch ? watch("event.date") : "";
  const blockedMatch = blockedDates.find((b) => b.date === selectedDate);

  if (currentEventType !== prevEventType) {
    setPrevEventType(currentEventType);
    setCustomText(extractCustomText(currentEventType));
  }

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === OTHER_OPTION) {
      const formatted = customText.trim() ? `Other: ${customText.trim()}` : OTHER_OPTION;
      setValue?.("event.eventType", formatted, { shouldValidate: true });
    } else {
      setValue?.("event.eventType", selected, { shouldValidate: true });
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomText(text);
    const formatted = text.trim() ? `Other: ${text.trim()}` : OTHER_OPTION;
    setValue?.("event.eventType", formatted, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 font-display">Step 4: Event Details</h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Specify your event logistics so we can verify schedule availability.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Event Type Dropdown */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Event Type *
          </label>
          <select
            value={selectedDropdownValue}
            onChange={handleDropdownChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
          >
            {standardEventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            <option value={OTHER_OPTION}>{OTHER_OPTION}</option>
          </select>
          {errors.event?.eventType && !isOtherSelected && (
            <p className="text-xs text-red-500 mt-1">{errors.event.eventType.message}</p>
          )}
        </div>

        {/* Custom Event Type Input (shown when Other Special Event is selected) */}
        {isOtherSelected && (
          <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-purple-600" />
              <span>Specify Custom Event Type *</span>
            </label>
            <input
              type="text"
              value={customText}
              onChange={handleCustomTextChange}
              placeholder="e.g. Anniversary Celebration, Graduation, Housewarming..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
              autoFocus
            />
            {errors.event?.eventType && (
              <p className="text-xs text-red-500 mt-1">{errors.event.eventType.message}</p>
            )}
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            <span>Event Date *</span>
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            {...register("event.date")}
            className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none ${
              blockedMatch ? "border-amber-400 bg-amber-50/40" : "border-slate-200 focus:border-purple-500"
            }`}
          />
          {blockedMatch && (
            <div className="p-2.5 mt-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>This date is unavailable ({blockedMatch.reason}). Please select another date.</span>
            </div>
          )}
          {errors.event?.date && !blockedMatch && (
            <p className="text-xs text-red-500 mt-1">{errors.event.date.message}</p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>Start Time *</span>
          </label>
          <input
            type="time"
            {...register("event.time")}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
          />
          {errors.event?.time && (
            <p className="text-xs text-red-500 mt-1">{errors.event.time.message}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Performance Duration (Hours) *
          </label>
          <select
            {...register("event.durationHours", { valueAsNumber: true })}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
          >
            <option value={2}>2 Hours</option>
            <option value={3}>3 Hours (Standard Base)</option>
            <option value={4}>4 Hours (+15% extra hour charge)</option>
            <option value={5}>5 Hours (+30% extra hour charge)</option>
            <option value={6}>6 Hours (+45% extra hour charge)</option>
          </select>
          {errors.event?.durationHours && (
            <p className="text-xs text-red-500 mt-1">{errors.event.durationHours.message}</p>
          )}
        </div>

        {/* Expected Guests */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Expected Guests *</span>
          </label>
          <input
            type="number"
            min={1}
            placeholder="e.g. 150"
            {...register("event.expectedGuests", { valueAsNumber: true })}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
          />
          {errors.event?.expectedGuests && (
            <p className="text-xs text-red-500 mt-1">{errors.event.expectedGuests.message}</p>
          )}
        </div>

        {/* Venue Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-purple-600" />
            <span>Venue / Location Name *</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Grand Horizon Ballroom"
            {...register("event.venue")}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
          />
          {errors.event?.venue && (
            <p className="text-xs text-red-500 mt-1">{errors.event.venue.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>City / Region *</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Music City, CA"
            {...register("event.city")}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
          />
          {errors.event?.city && (
            <p className="text-xs text-red-500 mt-1">{errors.event.city.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}


