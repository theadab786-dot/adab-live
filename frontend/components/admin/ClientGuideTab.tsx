"use client";

import React from "react";
import {
  BookOpen,
  Image as ImageIcon,
  Phone,
  Music,
  Speaker,
  Calendar,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export function ClientGuideTab() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-200" />
          <span>Non-Coder Friendly</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
          Website Owner Quick Guide & Manual
        </h2>
        <p className="text-purple-100 text-sm max-w-2xl leading-relaxed">
          Welcome to your Adab Live Control Center. You don't need any coding knowledge to run your website. Everything can be updated right from this dashboard in seconds!
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Photos */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            1. How to Change & Delete Photos
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Band Lineups:</strong> Go to the <strong>🎸 Live Band Lineups</strong> tab, click on any lineup, and scroll down to the photo section. Click <strong>Upload New Photo</strong> to choose a picture from your computer or phone.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Sound Setups:</strong> Go to the <strong>🔊 Sound Setups</strong> tab, click any setup, and upload equipment or stage photos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Homepage & About Photos:</strong> Go to <strong>📞 Contact & About</strong> and upload a new Hero banner or About Us photo.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Deleting a Photo:</strong> Hover over any photo thumbnail and click the red trash can icon. It will be removed immediately.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Setting Cover Photo:</strong> Hover over any photo and click the purple star button to make it the main cover image.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 2: Contact Info */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            2. Changing Phone, WhatsApp & Socials
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Go to the <strong>📞 Contact & About</strong> tab.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Update your <strong>Phone Number</strong> (e.g. for phone calls), <strong>WhatsApp Number</strong>, and official <strong>Email Address</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Update your <strong>Instagram, YouTube, or Facebook</strong> URLs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Click the purple <strong>Save All Changes</strong> button at the top or bottom of the page. The changes will immediately appear on the website Header, Footer, and Contact page.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 3: Sound Setups */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Speaker className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            3. Changing Sound Setups & Specs
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Go to the <strong>🔊 Sound Setups</strong> tab.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Click on any setup (like <em>Basic Setup</em>, <em>Setup 2</em>, or <em>Classic Setup</em>) to edit it.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                You can change the <strong>Base Price</strong> (in ₹ INR), the <strong>Price Range Display</strong> (e.g. ₹20,000 – ₹35,000), and crowd capacity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                You can edit the gear details: <strong>Speakers</strong>, <strong>Monitors</strong>, <strong>Bass Subwoofers</strong>, <strong>Microphones</strong>, and <strong>Operators</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Click <strong>Save All Sound</strong> when you are done.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 4: Band Lineups */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Music className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            4. Changing Live Band Lineups & Prices
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Go to the <strong>🎸 Live Band Lineups</strong> tab.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Click on any lineup to expand it. You can change the <strong>Formation Name</strong>, <strong>Tagline</strong>, and <strong>Starting Fee (₹)</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Under <strong>Band Members & Instruments</strong>, you can add or remove instruments (e.g. Lead Vocalist, Saxophonist, Drummer).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Click <strong>Add New Lineup</strong> if you want to offer a new package (like Trio or Big Band).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Click <strong>Save All Lineups</strong> to publish your changes.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Photography & Media Tips Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Pro Tips for Best Photo Quality</span>
        </div>
        <h4 className="text-lg font-bold font-display">Tips for Clean, Professional Photos</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
          <div>
            <span className="font-bold text-white block mb-1">Recommended Dimensions</span>
            Horizontal landscape photos (e.g. 1920×1080 or 1200×800) look best for banners and stage shots. Square or vertical photos work well inside lineup galleries.
          </div>
          <div>
            <span className="font-bold text-white block mb-1">Supported File Formats</span>
            You can upload JPG, JPEG, PNG, and WEBP. Images under 5MB upload fastest and load smoothly on mobile phones.
          </div>
          <div>
            <span className="font-bold text-white block mb-1">Stage Lighting</span>
            Photos taken with stage ambient lighting or golden hour outdoor lighting give your band a premium, cinematic feel.
          </div>
        </div>
      </div>
    </div>
  );
}
