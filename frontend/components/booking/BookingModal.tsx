"use client";

import React, { useState, useEffect, useEffectEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, CalendarCheck, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { BookingSchema, BookingPayload, ServiceType } from "@/lib/schemas";
import { Summary } from "./Summary";
import { StepService } from "./StepService";
import { StepBand } from "./StepBand";
import { StepSound } from "./StepSound";
import { StepEvent } from "./StepEvent";
import { StepContact } from "./StepContact";
import lineups from "../../data/lineups.json";
import musicians from "../../data/musicians.json";
import soundCatalog from "../../data/sound.json";
import { calculateBookingEstimate } from "@/lib/pricing";

export type BookingFormData = BookingPayload;

const SESSION_STORAGE_KEY = "adab_live_booking_draft";

export function BookingModal() {
  const { isOpen, closeBookingModal, preselect } = useBooking();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize form with defaults & preselects
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema) as any,
    defaultValues: {
      serviceType: "both",
      band: {
        presetId: "duet",
        customMusicianIds: [],
      },
      sound: {
        packageId: "basic-setup",
        addonIds: [],
      },
      event: {
        eventType: "Wedding Reception",
        date: new Date().toISOString().split("T")[0],
        time: "18:00",
        durationHours: 3,
        venue: "",
        city: "",
        expectedGuests: 100,
      },
      contact: {
        name: "",
        phone: "",
        email: "",
        notes: "",
        customQuoteRequested: false,
        hp: "",
      },
      estimateTotal: 0,
    },
  });

  const formValues = watch();

  // Handle preselect props from BookingContext
  const updatePreselects = useEffectEvent((opt: typeof preselect) => {
    if (opt.serviceType) {
      setValue("serviceType", opt.serviceType);
    }
    if (opt.presetLineupId) {
      setValue("band.presetId", opt.presetLineupId);
      setValue("band.customMusicianIds", []);
    }
    if (opt.soundPackageId) {
      setValue("sound.packageId", opt.soundPackageId);
    }
  });

  useEffect(() => {
    if (isOpen) {
      updatePreselects(preselect);
    }
  }, [isOpen, preselect]);

  // Persist form state in sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          reset(parsed);
        } catch {
          // ignore invalid json
        }
      }
    }
  }, [reset]);

  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(formValues));
    }
  }, [formValues, isOpen]);

  // Listen for ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeBookingModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeBookingModal]);

  // Calculate live total and keep estimateTotal in sync
  useEffect(() => {
    const { total } = calculateBookingEstimate(
      formValues,
      lineups,
      musicians,
      soundCatalog
    );
    if (formValues.estimateTotal !== total) {
      setValue("estimateTotal", total);
    }
  }, [formValues, setValue]);

  if (!isOpen) return null;

  // Determine step sequence
  const getStepSequence = (service: ServiceType): number[] => {
    if (service === "live-band") return [1, 2, 4, 5];
    if (service === "sound-setup") return [1, 3, 4, 5];
    return [1, 2, 3, 4, 5];
  };

  const stepsSequence = getStepSequence(formValues.serviceType);
  const sequenceIndex = stepsSequence.indexOf(currentStep);
  const isFirstStep = sequenceIndex === 0;
  const isLastStep = sequenceIndex === stepsSequence.length - 1;

  const handleNextStep = async () => {
    let fieldsToValidate: string[] = [];
    if (currentStep === 1) fieldsToValidate = ["serviceType"];
    if (currentStep === 4) fieldsToValidate = ["event.eventType", "event.date", "event.time", "event.durationHours", "event.venue", "event.city", "event.expectedGuests"];
    if (currentStep === 5) fieldsToValidate = ["contact.name", "contact.phone", "contact.email"];

    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate as any) : true;

    if (isValid && currentStep === 4) {
      try {
        const bdRes = await fetch("/api/blocked-dates");
        const bdData = await bdRes.json();
        if (Array.isArray(bdData?.blockedDates)) {
          const match = bdData.blockedDates.find((b: any) => b.date === formValues.event?.date);
          if (match) {
            setSubmitError(`The selected date (${formValues.event.date}) is unavailable: ${match.reason}. Please select an open date.`);
            return;
          }
        }
      } catch {
        // network fallback
      }
      setSubmitError(null);
    }

    if (isValid && sequenceIndex < stepsSequence.length - 1) {
      setCurrentStep(stepsSequence[sequenceIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    if (sequenceIndex > 0) {
      setCurrentStep(stepsSequence[sequenceIndex - 1]);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout safeguard

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData.error || "Failed to process booking request");
      }

      setSubmittedBookingId(resData.bookingId || `ADB-${Math.floor(1000 + Math.random() * 9000)}`);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Booking submission error:", err);
      const isAbort = err.name === "AbortError";
      const message = isAbort
        ? "The request took too long to respond. Please check your connection and try again."
        : err.message || "Failed to submit booking request. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetModal = () => {
    setSubmittedBookingId(null);
    setCurrentStep(1);
    closeBookingModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-6 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={closeBookingModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors z-20"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedBookingId ? (
          /* Success Screen */
          <div className="w-full p-8 sm:p-12 text-center space-y-6 my-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 font-display">Booking Request Submitted!</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you, <span className="font-semibold text-slate-900">{formValues.contact.name}</span>! We have received your request for <span className="font-semibold text-slate-900">{formValues.event.date}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto space-y-1 text-xs">
              <div className="text-slate-500">Request Confirmation ID:</div>
              <div className="text-xl font-extrabold text-purple-600 font-display">{submittedBookingId}</div>
              <div className="text-[11px] text-slate-400 pt-1">
                An acknowledgement email has been dispatched to {formValues.contact.email}. The band owner will confirm your date shortly.
              </div>
            </div>

            <button
              onClick={handleResetModal}
              className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <>
            {/* Form Wizard Left Panel */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
              {/* Header & Step Indicator */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 id="booking-modal-title" className="text-xl font-bold text-slate-900 font-display">
                      Book Adab Live
                    </h2>
                    <p className="text-xs text-slate-500">Request & Confirm • Instant Price Estimate</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-1.5 pt-2">
                  {stepsSequence.map((stepNum, idx) => {
                    const isCompleted = sequenceIndex > idx;
                    const isCurrent = currentStep === stepNum;
                    return (
                      <div
                        key={stepNum}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          isCurrent
                            ? "bg-purple-600"
                            : isCompleted
                            ? "bg-purple-300"
                            : "bg-slate-200"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Step Content Components */}
              <div className="py-2">
                {currentStep === 1 && (
                  <StepService
                    selectedService={formValues.serviceType}
                    onSelectService={(s) => {
                      setValue("serviceType", s);
                    }}
                  />
                )}

                {currentStep === 2 && (
                  <StepBand
                    presetLineupId={formValues.band?.presetId}
                    customMusicianIds={formValues.band?.customMusicianIds || []}
                    onSelectPreset={(slug) => {
                      setValue("band.presetId", slug);
                      setValue("band.customMusicianIds", []);
                    }}
                    onToggleCustomMusician={(id) => {
                      setValue("band.presetId", undefined);
                      const current = formValues.band?.customMusicianIds || [];
                      const updated = current.includes(id)
                        ? current.filter((mId) => mId !== id)
                        : [...current, id];
                      setValue("band.customMusicianIds", updated);
                    }}
                    onClearBandSelection={() => {
                      setValue("band.presetId", undefined);
                      setValue("band.customMusicianIds", []);
                    }}
                  />
                )}

                {currentStep === 3 && (
                  <StepSound
                    soundPackageId={formValues.sound?.packageId}
                    soundAddonIds={formValues.sound?.addonIds || []}
                    onSelectPackage={(id) => setValue("sound.packageId", id)}
                    onToggleAddon={(id) => {
                      const current = formValues.sound?.addonIds || [];
                      const updated = current.includes(id)
                        ? current.filter((aId) => aId !== id)
                        : [...current, id];
                      setValue("sound.addonIds", updated);
                    }}
                  />
                )}

                {currentStep === 4 && (
                  <StepEvent
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                  />
                )}

                {currentStep === 5 && <StepContact register={register} errors={errors} />}
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isFirstStep}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isFirstStep
                      ? "opacity-0 pointer-events-none"
                      : "text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all transform active:scale-95"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit((data: any) => onSubmit(data))}
                    disabled={isSubmitting}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all transform active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Submit Booking Request</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Live Summary Right Sidebar */}
            <div className="w-full md:w-80 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
              <Summary
                serviceType={formValues.serviceType}
                presetLineupId={formValues.band?.presetId}
                customMusicianIds={formValues.band?.customMusicianIds || []}
                soundPackageId={formValues.sound?.packageId}
                soundAddonIds={formValues.sound?.addonIds || []}
                eventDate={formValues.event?.date}
                eventTime={formValues.event?.time}
                durationHours={formValues.event?.durationHours}
                city={formValues.event?.city}
                venue={formValues.event?.venue}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

