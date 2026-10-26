"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Speaker,
  Mic,
  Sliders,
  ChevronDown,
  ChevronUp,
  Wrench,
  Check,
  Tag,
} from "lucide-react";
import { PhotoManager } from "./PhotoManager";

export interface SoundItem {
  id: string;
  name: string;
  setupNumber?: string;
  shortName?: string;
  tagline: string;
  badge?: string;
  crowdCapacity?: string;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string;
  priceDisplay?: string;
  category: "package" | "addon";
  forSetup?: string;
  operators?: string;
  speakers?: string;
  monitors?: string;
  bass?: string;
  mics?: string;
  cabling?: string;
  soundBrands?: string[];
  lighting?: string;
  description: string;
  features: string[];
  photos: string[];
}

interface SoundTabProps {
  initialSound: SoundItem[];
  onRefresh?: () => void;
}

export function SoundTab({ initialSound = [], onRefresh }: SoundTabProps) {
  const [soundItems, setSoundItems] = useState<SoundItem[]>(initialSound);
  const [filterCategory, setFilterCategory] = useState<"all" | "package" | "addon">("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field change
  const handleUpdateItem = (index: number, field: keyof SoundItem, value: any) => {
    setSoundItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Features list helpers
  const handleAddFeature = (itemIndex: number) => {
    setSoundItems((prev) => {
      const updated = [...prev];
      const features = [...(updated[itemIndex].features || [])];
      features.push("New audio feature or specification");
      updated[itemIndex] = { ...updated[itemIndex], features };
      return updated;
    });
  };

  const handleUpdateFeature = (itemIndex: number, featureIndex: number, val: string) => {
    setSoundItems((prev) => {
      const updated = [...prev];
      const features = [...updated[itemIndex].features];
      features[featureIndex] = val;
      updated[itemIndex] = { ...updated[itemIndex], features };
      return updated;
    });
  };

  const handleDeleteFeature = (itemIndex: number, featureIndex: number) => {
    setSoundItems((prev) => {
      const updated = [...prev];
      const features = updated[itemIndex].features.filter((_, idx) => idx !== featureIndex);
      updated[itemIndex] = { ...updated[itemIndex], features };
      return updated;
    });
  };

  // Add new Sound Item
  const handleAddNewItem = (category: "package" | "addon") => {
    const newItem: SoundItem = {
      id: `sound-${Date.now()}`,
      name: category === "package" ? "New Sound Setup" : "New Audio Add-on",
      setupNumber: category === "package" ? "Custom" : undefined,
      shortName: "Sound Package",
      tagline: "High quality audio equipment for your event",
      badge: "Custom Gathering",
      crowdCapacity: "50 to 100 people gathering",
      price: category === "package" ? 15000 : 2000,
      priceRange: category === "package" ? "₹15,000 – ₹20,000" : "₹2,000",
      priceDisplay: category === "package" ? "15k to 20k" : "+₹2,000",
      category,
      operators: "1 Sound Operator on-site",
      speakers: "2 × Powered Active Speakers",
      monitors: "Stage monitors available",
      bass: "Dedicated subwoofer bass",
      mics: "2 Cordless / Wireless Mics",
      cabling: "All wire connectivity provided by sound men",
      soundBrands: ["JBL", "RCF"],
      lighting: "Stage lighting optional",
      description: "Clean, balanced sound tailored for indoor or outdoor venues.",
      features: [
        "Professional audio equipment",
        "Dedicated sound operator on-site",
        "All wiring and setup included",
      ],
      photos: ["/images/sound/pa-basic.jpg"],
    };

    setSoundItems((prev) => [...prev, newItem]);
    setExpandedIndex(soundItems.length);
  };

  // Delete Item
  const handleDeleteItem = (index: number) => {
    if (confirm(`Are you sure you want to remove "${soundItems[index].name}"?`)) {
      setSoundItems((prev) => prev.filter((_, idx) => idx !== index));
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
          type: "sound",
          data: soundItems,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to save sound equipment.");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while saving sound setups.");
    } finally {
      setSaving(false);
    }
  };

  // Filtered
  const filteredItems = soundItems.filter((item) => {
    if (filterCategory === "all") return true;
    return item.category === filterCategory;
  });

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Speaker className="w-5 h-5 text-purple-600" />
            <span>Sound Setups, Audio Specs & Photos</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage stage audio setups (Basic Setup, Setup 2, Classic Setup, Add-ons), update prices, audio specs, and equipment photos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleAddNewItem("package")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sound Setup</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddNewItem("addon")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Add-on</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Sound</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterCategory === "all"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Items ({soundItems.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory("package")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterCategory === "package"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Sound Packages ({soundItems.filter((s) => s.category === "package").length})
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory("addon")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterCategory === "addon"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Add-ons ({soundItems.filter((s) => s.category === "addon").length})
        </button>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Sound setups, audio specifications, and equipment photos saved and live on the website!
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Sound Items List */}
      <div className="space-y-6">
        {filteredItems.map((item, index) => {
          const isExpanded = expandedIndex === index;
          const coverPhoto = item.photos?.[0] || "/images/sound/pa-basic.jpg";

          return (
            <div
              key={item.id || index}
              className="glass-panel bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <Image
                      src={coverPhoto}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 font-display">{item.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          item.category === "package"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {item.category === "package" ? "Stage Package" : "Add-on"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-400">Price Display</div>
                    <div className="text-base font-extrabold text-purple-700">
                      {item.priceRange || `₹${item.price.toLocaleString("en-IN")}`}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Setup Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(index, "name", e.target.value)}
                        placeholder="e.g. Basic Setup, Setup 2, Classic Setup"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Setup Number / Badge
                      </label>
                      <input
                        type="text"
                        value={item.setupNumber || ""}
                        onChange={(e) => handleUpdateItem(index, "setupNumber", e.target.value)}
                        placeholder="e.g. 1, 2, or Classic"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Crowd Capacity / Badge
                      </label>
                      <input
                        type="text"
                        value={item.crowdCapacity || item.badge || ""}
                        onChange={(e) => {
                          handleUpdateItem(index, "crowdCapacity", e.target.value);
                          handleUpdateItem(index, "badge", e.target.value);
                        }}
                        placeholder="e.g. 20 to 40+ People Gathering"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Pricing info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Base / Starting Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(index, "price", Number(e.target.value))}
                        placeholder="10000"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-extrabold text-purple-700 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Price Range Display Text
                      </label>
                      <input
                        type="text"
                        value={item.priceRange || ""}
                        onChange={(e) => handleUpdateItem(index, "priceRange", e.target.value)}
                        placeholder="e.g. ₹10,000 – ₹15,000"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Short Price Tag
                      </label>
                      <input
                        type="text"
                        value={item.priceDisplay || ""}
                        onChange={(e) => handleUpdateItem(index, "priceDisplay", e.target.value)}
                        placeholder="e.g. 10k to 15k or +₹1,000"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="pt-2 border-t border-slate-200/80 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-purple-600" />
                      <span>Audio Engineering Specifications</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Sound Operators
                        </label>
                        <input
                          type="text"
                          value={item.operators || ""}
                          onChange={(e) => handleUpdateItem(index, "operators", e.target.value)}
                          placeholder="e.g. 1 Sound Operator"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Speakers / PA
                        </label>
                        <input
                          type="text"
                          value={item.speakers || ""}
                          onChange={(e) => handleUpdateItem(index, "speakers", e.target.value)}
                          placeholder="e.g. 2/4 × 15-inch JBL Powered Speakers"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Stage Floor Monitors
                        </label>
                        <input
                          type="text"
                          value={item.monitors || ""}
                          onChange={(e) => handleUpdateItem(index, "monitors", e.target.value)}
                          placeholder="e.g. 2/4 × 15-inch Stage Monitors"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Bass / Subwoofers
                        </label>
                        <input
                          type="text"
                          value={item.bass || ""}
                          onChange={(e) => handleUpdateItem(index, "bass", e.target.value)}
                          placeholder="e.g. 2 Dedicated Bass / Subwoofers"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Microphones
                        </label>
                        <input
                          type="text"
                          value={item.mics || ""}
                          onChange={(e) => handleUpdateItem(index, "mics", e.target.value)}
                          placeholder="e.g. 2 Cordless / Wireless Mics"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Cabling & Wiring
                        </label>
                        <input
                          type="text"
                          value={item.cabling || ""}
                          onChange={(e) => handleUpdateItem(index, "cabling", e.target.value)}
                          placeholder="e.g. All wire connectivity sound men will provide"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Setup Overview Description
                    </label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => handleUpdateItem(index, "description", e.target.value)}
                      placeholder="Describe what kind of venue or event this sound setup is engineered for..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm leading-relaxed focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* PHOTOS MANAGER SECTION */}
                  <div className="pt-2 border-t border-slate-200/80">
                    <PhotoManager
                      title={`${item.name} Equipment Photos`}
                      description="Upload photos of this PA sound system, speakers, mixers, or live stages. First photo is used as the cover."
                      photos={item.photos || []}
                      onChange={(updatedPhotos) => handleUpdateItem(index, "photos", updatedPhotos)}
                    />
                  </div>

                  {/* Bullet Points / Features List */}
                  <div className="pt-2 border-t border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 font-display">
                        Bullet Point Specifications / Features
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleAddFeature(index)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-400 text-slate-700 text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-purple-600" />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(item.features || []).map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleUpdateFeature(index, fIdx, e.target.value)}
                            className="flex-1 text-xs px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteFeature(index, fIdx)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove feature"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delete Item Action */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
                      className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete This Setup</span>
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
