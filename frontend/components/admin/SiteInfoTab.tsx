"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Globe,
  Info,
  Sparkles,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "../SocialIcons";
import { PhotoManager } from "./PhotoManager";

interface SiteInfoTabProps {
  initialData: any;
  onRefresh?: () => void;
}

export function SiteInfoTab({ initialData, onRefresh }: SiteInfoTabProps) {
  const [formData, setFormData] = useState({
    bandName: initialData?.bandName || "Adab Live",
    tagline: initialData?.tagline || "",
    phone: initialData?.phone || "",
    whatsapp: initialData?.whatsapp || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    socials: {
      instagram: initialData?.socials?.instagram || "",
      youtube: initialData?.socials?.youtube || "",
      facebook: initialData?.socials?.facebook || "",
    },
    aboutText: initialData?.aboutText || "",
    heroImage: initialData?.heroImage || "/images/hero-cover.jpg",
    aboutImage: initialData?.aboutImage || "/images/hero-cover.jpg",
    clips: initialData?.clips || [],
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if initialData loads or updates
  useEffect(() => {
    if (initialData) {
      setFormData({
        bandName: initialData?.bandName || "Adab Live",
        tagline: initialData?.tagline || "",
        phone: initialData?.phone || "",
        whatsapp: initialData?.whatsapp || "",
        email: initialData?.email || "",
        address: initialData?.address || "",
        socials: {
          instagram: initialData?.socials?.instagram || "",
          youtube: initialData?.socials?.youtube || "",
          facebook: initialData?.socials?.facebook || "",
        },
        aboutText: initialData?.aboutText || "",
        heroImage: initialData?.heroImage || "/images/hero-cover.jpg",
        aboutImage: initialData?.aboutImage || "/images/hero-cover.jpg",
        clips: initialData?.clips || [],
      });
    }
  }, [initialData]);

  // Field change helper
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (network: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [network]: value },
    }));
  };

  // Clips helpers
  const handleAddClip = () => {
    const newClip = {
      id: Date.now().toString(),
      title: "New Live Performance Clip",
      type: "youtube",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    };
    setFormData((prev) => ({ ...prev, clips: [...prev.clips, newClip] }));
  };

  const handleUpdateClip = (index: number, key: string, val: string) => {
    const updated = [...formData.clips];
    updated[index] = { ...updated[index], [key]: val };
    setFormData((prev) => ({ ...prev, clips: updated }));
  };

  const handleDeleteClip = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      clips: prev.clips.filter((_: any, idx: number) => idx !== index),
    }));
  };

  // Submit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "site",
          data: formData,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to save information.");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-10">
      {/* Top Banner Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Contact & Website Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your phone numbers, email, WhatsApp, about story, and banner photos. All changes go live immediately.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all transform active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Success! Your contact and website details have been updated and are live on the site.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* 1. Contact Details */}
      <section className="glass-panel bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Phone className="w-4 h-4 text-purple-600" />
            <span>Direct Client Contact Information</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            These numbers and links are displayed on the Contact page, Header, and Footer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number (Call)
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+1 (555) 987-6543"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Displayed for direct phone calls.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              WhatsApp Number (Digits only, including country code)
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              placeholder="e.g. 15559876543 or 919876543210"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Used for WhatsApp one-click chat links.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="booking@adablive.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Client inquiries will be routed here.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Base Location / Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="123 Concert Avenue, Music City"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Your primary city or studio base.</span>
          </div>
        </div>
      </section>

      {/* 2. Brand & Tagline */}
      <section className="glass-panel bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Brand Identity & Headlines</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your band or company name and central motto shown across the site.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Band / Company Name
            </label>
            <input
              type="text"
              value={formData.bandName}
              onChange={(e) => updateField("bandName", e.target.value)}
              placeholder="Adab Live"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Website Main Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
              placeholder="Captivating Live Music & Premium Audio Engineering"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Brand Logo Showcase */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-black rounded-xl border border-amber-500/30 shrink-0">
              <img
                src="/images/logo/logo-icon.png"
                alt="Adab Live Emblem"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-400">Official Brand Logo Active</h4>
              <p className="text-xs text-slate-300">
                Gold metallic emblem & typography with vintage microphone active across website & social sharing.
              </p>
            </div>
          </div>
          <div className="p-2 bg-black rounded-xl border border-amber-500/30 shrink-0">
            <img
              src="/images/logo/logo.png"
              alt="Adab Live Full Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            About Story / Bio
          </label>
          <textarea
            rows={4}
            value={formData.aboutText}
            onChange={(e) => updateField("aboutText", e.target.value)}
            placeholder="Describe the band's experience, passion, and what makes your live performances unique..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm leading-relaxed focus:outline-none focus:border-purple-500 focus:bg-white"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Featured on the About Us page and Homepage introductions.
          </span>
        </div>
      </section>

      {/* 3. Hero & About Page Photos */}
      <section className="glass-panel bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <span>Key Page Cover Photos (Hero & About)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Easily replace the big backdrop photos on your Homepage and About page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhotoManager
            title="Homepage Hero Cover Photo"
            description="The main background banner image on the front page."
            singlePhoto={true}
            photos={formData.heroImage ? [formData.heroImage] : []}
            onChange={(photos) => updateField("heroImage", photos[0] || "/images/hero-cover.jpg")}
          />

          <PhotoManager
            title="About Page Featured Photo"
            description="The primary showcase image on the About Us page."
            singlePhoto={true}
            photos={formData.aboutImage ? [formData.aboutImage] : []}
            onChange={(photos) => updateField("aboutImage", photos[0] || "/images/hero-cover.jpg")}
          />
        </div>
      </section>

      {/* 4. Social Media Channels */}
      <section className="glass-panel bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <InstagramIcon className="w-4 h-4 text-purple-600" />
            <span>Social Media Profiles</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Links open when visitors click the social icons in the header, footer, or contact page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
              <span>Instagram URL</span>
            </label>
            <input
              type="url"
              value={formData.socials.instagram}
              onChange={(e) => updateSocial("instagram", e.target.value)}
              placeholder="https://instagram.com/adablive"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <YoutubeIcon className="w-3.5 h-3.5 text-red-600" />
              <span>YouTube Channel URL</span>
            </label>
            <input
              type="url"
              value={formData.socials.youtube}
              onChange={(e) => updateSocial("youtube", e.target.value)}
              placeholder="https://youtube.com/@adablive"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Facebook Page URL</span>
            </label>
            <input
              type="url"
              value={formData.socials.facebook}
              onChange={(e) => updateSocial("facebook", e.target.value)}
              placeholder="https://facebook.com/adablive"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>
        </div>
      </section>

      {/* 5. Performance Clips (YouTube Videos) */}
      <section className="glass-panel bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-600" />
              <span>Performance Video Clips (YouTube)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Featured on the homepage video carousel so visitors can hear your band live.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddClip}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Video Clip</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.clips.map((clip: any, idx: number) => (
            <div
              key={clip.id || idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={clip.title}
                  onChange={(e) => handleUpdateClip(idx, "title", e.target.value)}
                  placeholder="Video Title (e.g. Live at Sunset Beach)"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="url"
                  value={clip.embedUrl}
                  onChange={(e) => handleUpdateClip(idx, "embedUrl", e.target.value)}
                  placeholder="YouTube Embed URL (e.g. https://www.youtube.com/embed/YOUR_VIDEO_ID)"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteClip(idx)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                title="Remove video clip"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all transform active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Contact & Site Information</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
