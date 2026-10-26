"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Music,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { PhotoManager } from "./PhotoManager";

interface LineupMember {
  role: string;
  instrument: string;
}

export interface LineupItem {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  members: LineupMember[];
  photos: string[];
  basePrice: number;
  priceNote: string;
}

interface LineupsTabProps {
  initialLineups: LineupItem[];
  onRefresh?: () => void;
}

export function LineupsTab({ initialLineups = [], onRefresh }: LineupsTabProps) {
  const [lineups, setLineups] = useState<LineupItem[]>(initialLineups);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when initialLineups loads or changes
  useEffect(() => {
    if (initialLineups && initialLineups.length > 0) {
      setLineups(initialLineups);
    }
  }, [initialLineups]);

  // Field change
  const handleUpdateLineup = (index: number, field: keyof LineupItem, value: any) => {
    setLineups((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Musician members helpers
  const handleAddMember = (lineupIndex: number) => {
    setLineups((prev) => {
      const updated = [...prev];
      const members = [...(updated[lineupIndex].members || [])];
      members.push({ role: "Guest Instrumentalist", instrument: "Instrument / Vocals" });
      updated[lineupIndex] = { ...updated[lineupIndex], members };
      return updated;
    });
  };

  const handleUpdateMember = (
    lineupIndex: number,
    memberIndex: number,
    field: keyof LineupMember,
    value: string
  ) => {
    setLineups((prev) => {
      const updated = [...prev];
      const members = [...updated[lineupIndex].members];
      members[memberIndex] = { ...members[memberIndex], [field]: value };
      updated[lineupIndex] = { ...updated[lineupIndex], members };
      return updated;
    });
  };

  const handleDeleteMember = (lineupIndex: number, memberIndex: number) => {
    setLineups((prev) => {
      const updated = [...prev];
      const members = updated[lineupIndex].members.filter((_, idx) => idx !== memberIndex);
      updated[lineupIndex] = { ...updated[lineupIndex], members };
      return updated;
    });
  };

  // Add new Lineup
  const handleAddNewLineup = () => {
    const newLineup: LineupItem = {
      slug: `lineup-${Date.now()}`,
      name: "New Band Lineup",
      tagline: "Custom live musical formation for your event",
      description: "Detailed description of the band's musical style, repertoire, and stage atmosphere.",
      members: [{ role: "Lead Musician", instrument: "Vocals / Instrument" }],
      photos: ["/images/hero-cover.jpg"],
      basePrice: 500,
      priceNote: "Starting price for 3-hour performance",
    };
    setLineups((prev) => [...prev, newLineup]);
    setExpandedIndex(lineups.length);
  };

  // Delete Lineup
  const handleDeleteLineup = (index: number) => {
    if (confirm(`Are you sure you want to remove "${lineups[index].name}"?`)) {
      setLineups((prev) => prev.filter((_, idx) => idx !== index));
      if (expandedIndex === index) setExpandedIndex(null);
    }
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lineups",
          data: lineups,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to save band lineups.");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while saving lineups.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-600" />
            <span>Live Music Band Lineups & Photos</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add or edit band lineups, update pricing, customize musician instruments, and upload or delete stage photos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddNewLineup}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lineup</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Lineups...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Lineups</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            All band lineups, musician details, and photos have been updated and are live on the website!
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Lineups List Accordion / Cards */}
      <div className="space-y-6">
        {lineups.map((lineup, index) => {
          const isExpanded = expandedIndex === index;
          const coverPhoto = lineup.photos?.[0] || "/images/hero-cover.jpg";

          return (
            <div
              key={lineup.slug || index}
              className="glass-panel bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Small Cover Preview */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <Image
                      src={coverPhoto}
                      alt={lineup.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 font-display">{lineup.name}</h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        {lineup.members?.length || 0} Musicians
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{lineup.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-400">Starting Price</div>
                    <div className="text-base font-extrabold text-purple-600">
                      ₹{lineup.basePrice?.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isExpanded && (
                <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/40 space-y-8 animate-in fade-in duration-200">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Formation Name
                      </label>
                      <input
                        type="text"
                        value={lineup.name}
                        onChange={(e) => handleUpdateLineup(index, "name", e.target.value)}
                        placeholder="e.g. Acoustic Solo, Duet, Five-Piece Band"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tagline / Catchphrase
                      </label>
                      <input
                        type="text"
                        value={lineup.tagline}
                        onChange={(e) => handleUpdateLineup(index, "tagline", e.target.value)}
                        placeholder="e.g. Soulful vocal & guitar experience"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Starting Fee (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={lineup.basePrice}
                        onChange={(e) => handleUpdateLineup(index, "basePrice", Number(e.target.value))}
                        placeholder="15000"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-extrabold text-purple-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Price Note / Subtitle
                    </label>
                    <input
                      type="text"
                      value={lineup.priceNote}
                      onChange={(e) => handleUpdateLineup(index, "priceNote", e.target.value)}
                      placeholder="e.g. Starting price for 3-hour event"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Detailed Description
                    </label>
                    <textarea
                      rows={3}
                      value={lineup.description}
                      onChange={(e) => handleUpdateLineup(index, "description", e.target.value)}
                      placeholder="Describe what events this lineup is best for, repertoire style, energy level..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm leading-relaxed focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* PHOTOS MANAGER SECTION */}
                  <div className="pt-2 border-t border-slate-200/80">
                    <PhotoManager
                      title={`${lineup.name} Photo Gallery`}
                      description="Photos will be displayed in this lineup's public showcase gallery and preview cards. First image is the cover photo."
                      photos={lineup.photos || []}
                      onChange={(updatedPhotos) => handleUpdateLineup(index, "photos", updatedPhotos)}
                    />
                  </div>

                  {/* MUSICIANS BREAKDOWN SECTION */}
                  <div className="pt-2 border-t border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>Band Members & Instruments</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          List each performer and the instrument they play.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddMember(index)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-400 text-slate-700 text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-purple-600" />
                        <span>Add Musician</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(lineup.members || []).map((member, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) =>
                                handleUpdateMember(index, mIdx, "role", e.target.value)
                              }
                              placeholder="Role (e.g. Lead Vocalist)"
                              className="w-full text-xs font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-100 focus:outline-none focus:border-purple-500"
                            />
                            <input
                              type="text"
                              value={member.instrument}
                              onChange={(e) =>
                                handleUpdateMember(index, mIdx, "instrument", e.target.value)
                              }
                              placeholder="Instrument (e.g. Acoustic Guitar, Vocals)"
                              className="w-full text-xs text-purple-600 font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100 focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteMember(index, mIdx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove musician"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delete Lineup Action */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeleteLineup(index)}
                      className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete This Lineup</span>
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
