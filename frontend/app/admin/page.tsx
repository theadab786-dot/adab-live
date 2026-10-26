"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  ShieldCheck,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  User,
  Phone,
  Mail,
  MapPin,
  Trash2,
  PlusCircle,
  Eye,
  X,
  Sparkles,
  Music,
  Speaker,
  Image as ImageIcon,
  BookOpen,
  FileText,
  Loader2,
} from "lucide-react";
import { FirestoreBookingDoc } from "@/lib/bookingsService";
import { SiteInfoTab } from "@/components/admin/SiteInfoTab";
import { LineupsTab } from "@/components/admin/LineupsTab";
import { SoundTab } from "@/components/admin/SoundTab";
import { MediaGalleryTab } from "@/components/admin/MediaGalleryTab";
import { ClientGuideTab } from "@/components/admin/ClientGuideTab";
import defaultSiteData from "@/data/site.json";
import defaultLineups from "@/data/lineups.json";
import defaultSoundCatalog from "@/data/sound.json";

type AdminTab =
  | "bookings"
  | "blocked-dates"
  | "contact"
  | "lineups"
  | "sound"
  | "media"
  | "guide";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("bookings");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bookings, setBookings] = useState<FirestoreBookingDoc[]>([]);
  const [blockedDates, setBlockedDates] = useState<{ date: string; reason: string }[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingBlocked, setLoadingBlocked] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<FirestoreBookingDoc | null>(null);

  // Content state for site, lineups, sound initialized with defaults
  const [siteData, setSiteData] = useState<any>(defaultSiteData);
  const [lineupsData, setLineupsData] = useState<any[]>(defaultLineups);
  const [soundData, setSoundData] = useState<any[]>(defaultSoundCatalog);
  const [loadingContent, setLoadingContent] = useState(false);

  // New blocked date form state
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedReason, setNewBlockedReason] = useState("");
  const [blockError, setBlockError] = useState<string | null>(null);

  // Check auth cookie on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasCookie = document.cookie.includes("adab_admin_authenticated=true");
      if (!hasCookie) {
        router.push("/admin/login");
      }
    }
  }, [router]);

  // Fetch all site content
  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.site) setSiteData(json.data.site);
        if (json.data.lineups && Array.isArray(json.data.lineups) && json.data.lineups.length > 0) {
          setLineupsData(json.data.lineups);
        }
        if (json.data.sound && Array.isArray(json.data.sound) && json.data.sound.length > 0) {
          setSoundData(json.data.sound);
        }
      }
    } catch (err) {
      console.error("Failed to load admin content:", err);
    } finally {
      setLoadingContent(false);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch(`/api/admin/bookings?status=${statusFilter}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch admin bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch blocked dates
  const fetchBlockedDates = async () => {
    setLoadingBlocked(true);
    try {
      const res = await fetch("/api/blocked-dates");
      const data = await res.json();
      setBlockedDates(data.blockedDates || []);
    } catch (err) {
      console.error("Failed to fetch blocked dates:", err);
    } finally {
      setLoadingBlocked(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  useEffect(() => {
    fetchBlockedDates();
    fetchContent();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "confirmed" | "declined") => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update booking status");
      }

      await fetchBookings();
      await fetchBlockedDates();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert(err.message || "Error updating status");
    }
  };

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlockError(null);

    if (!newBlockedDate || !newBlockedReason) {
      setBlockError("Please select a date and enter a reason.");
      return;
    }

    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newBlockedDate, reason: newBlockedReason }),
      });

      if (!res.ok) throw new Error("Failed to block date");

      setNewBlockedDate("");
      setNewBlockedReason("");
      await fetchBlockedDates();
    } catch (err: any) {
      setBlockError(err.message || "Error blocking date");
    }
  };

  const handleRemoveBlockedDate = async (dateStr: string) => {
    try {
      const res = await fetch(`/api/admin/blocked-dates?date=${dateStr}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to unblock date");

      await fetchBlockedDates();
    } catch (err: any) {
      alert(err.message || "Error unblocking date");
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth).catch(() => {});
    }
    document.cookie = "adab_admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const declinedCount = bookings.filter((b) => b.status === "declined").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Owner Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel bg-white rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black border border-amber-500/30 flex items-center justify-center shadow-md shadow-black/20 shrink-0 overflow-hidden p-1">
            <Image
              src="/images/logo/logo-icon.png"
              alt="Adab Live"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-display">Adab Live Control Center</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                Owner Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage website photos, contact info, live band lineups, sound packages, and bookings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("guide")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Owner Guide</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "bookings"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>📅 Bookings</span>
          {pendingCount > 0 && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "bookings" ? "bg-white text-purple-600" : "bg-purple-100 text-purple-700"
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "contact"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>📞 Contact & About</span>
        </button>

        <button
          onClick={() => setActiveTab("lineups")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "lineups"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Music className="w-4 h-4" />
          <span>🎸 Live Band Lineups & Photos</span>
        </button>

        <button
          onClick={() => setActiveTab("sound")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "sound"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Speaker className="w-4 h-4" />
          <span>🔊 Sound Setups & Specs</span>
        </button>

        <button
          onClick={() => setActiveTab("media")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "media"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>🖼️ Media Hub</span>
        </button>

        <button
          onClick={() => setActiveTab("blocked-dates")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "blocked-dates"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>🚫 Blocked Dates</span>
        </button>

        <button
          onClick={() => setActiveTab("guide")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "guide"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📖 Client Guide</span>
        </button>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. CONTACT & SITE INFO TAB */}
      {activeTab === "contact" && (
        <div>
          {loadingContent || !siteData ? (
            <div className="p-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              <span className="text-xs text-slate-500 font-semibold">Loading site settings...</span>
            </div>
          ) : (
            <SiteInfoTab initialData={siteData} onRefresh={fetchContent} />
          )}
        </div>
      )}

      {/* 2. BAND LINEUPS TAB */}
      {activeTab === "lineups" && (
        <div>
          {loadingContent ? (
            <div className="p-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              <span className="text-xs text-slate-500 font-semibold">Loading band formations...</span>
            </div>
          ) : (
            <LineupsTab initialLineups={lineupsData} onRefresh={fetchContent} />
          )}
        </div>
      )}

      {/* 3. SOUND SETUPS TAB */}
      {activeTab === "sound" && (
        <div>
          {loadingContent ? (
            <div className="p-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              <span className="text-xs text-slate-500 font-semibold">Loading sound equipment...</span>
            </div>
          ) : (
            <SoundTab initialSound={soundData} onRefresh={fetchContent} />
          )}
        </div>
      )}

      {/* 4. MEDIA GALLERY TAB */}
      {activeTab === "media" && <MediaGalleryTab />}

      {/* 5. CLIENT GUIDE TAB */}
      {activeTab === "guide" && <ClientGuideTab />}

      {/* 6. BOOKINGS TAB */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-panel bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                Total Requests
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
                {bookings.length}
              </span>
            </div>

            <div className="glass-panel bg-white p-5 rounded-2xl border border-purple-200 shadow-xs">
              <span className="text-xs text-purple-600 font-semibold uppercase tracking-wider block">
                Pending Actions
              </span>
              <span className="text-3xl font-extrabold text-purple-600 mt-1 block">{pendingCount}</span>
            </div>

            <div className="glass-panel bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
              <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider block">
                Confirmed Dates
              </span>
              <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">
                {confirmedCount}
              </span>
            </div>

            <div className="glass-panel bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                Declined
              </span>
              <span className="text-3xl font-extrabold text-slate-500 mt-1 block">{declinedCount}</span>
            </div>
          </div>

          {/* Bookings Filter Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">Filter by status:</span>
            </div>

            <div className="flex items-center gap-2">
              {["all", "pending", "confirmed", "declined"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    statusFilter === filter
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {loadingBookings ? (
            <div className="text-center py-16 text-slate-500 text-sm">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-white border border-slate-200/80 p-8 space-y-2">
              <p className="text-base font-bold text-slate-800">No booking requests found</p>
              <p className="text-xs text-slate-500">
                Incoming quotes submitted by clients on your website will show up right here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="glass-panel bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-500">{booking.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : booking.status === "declined"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-base font-bold text-slate-900 font-display">
                      {booking.contact.name} —{" "}
                      <span className="text-purple-600 font-sans">{booking.event.eventType}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        <span>
                          {booking.event.date} at {booking.event.time} ({booking.event.durationHours} hrs)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-600" />
                        <span>
                          {booking.event.venue}, {booking.event.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-600" />
                        <span>{booking.event.expectedGuests} Guests</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Estimate Total
                      </span>
                      <span className="text-xl font-extrabold text-slate-900">
                        ₹{booking.estimateTotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {booking.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking.id, "declined")}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-500 hover:text-white text-slate-700 font-bold text-xs transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. BLOCKED DATES TAB */}
      {activeTab === "blocked-dates" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">Block Out a Calendar Date</h3>
            <p className="text-xs text-slate-500">
              Blocked dates are immediately disabled in the client booking calendar to prevent double-booking.
            </p>

            {blockError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">{blockError}</div>
            )}

            <form onSubmit={handleAddBlockedDate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Reason for Block
                </label>
                <input
                  type="text"
                  value={newBlockedReason}
                  onChange={(e) => setNewBlockedReason(e.target.value)}
                  placeholder="e.g. Band Rehearsal or Private Gig"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add to Blocked Dates</span>
              </button>
            </form>
          </div>

          <div className="md:col-span-2 glass-panel bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Active Blocked Dates ({blockedDates.length})
            </h3>

            {loadingBlocked ? (
              <div className="text-xs text-slate-500 py-8 text-center">Loading dates...</div>
            ) : blockedDates.length === 0 ? (
              <div className="text-xs text-slate-400 py-8 text-center">No dates currently blocked.</div>
            ) : (
              <div className="space-y-3">
                {blockedDates.map((block) => (
                  <div
                    key={block.date}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 font-mono">{block.date}</div>
                      <div className="text-xs text-purple-600 mt-0.5">{block.reason}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveBlockedDate(block.date)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Unblock Date"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-900 space-y-6 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                  Booking Details
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900">{selectedBooking.id}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimate Total</span>
                <span className="text-2xl font-extrabold text-purple-600">
                  ₹{selectedBooking.estimateTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
                  <User className="w-4 h-4 text-purple-600" />
                  <span>Customer Contact</span>
                </div>
                <div>
                  • Name: <span className="font-semibold text-slate-900">{selectedBooking.contact.name}</span>
                </div>
                <div>
                  • Phone:{" "}
                  <span className="font-semibold text-slate-900">{selectedBooking.contact.phone}</span>
                </div>
                <div>
                  • Email:{" "}
                  <span className="font-semibold text-slate-900">{selectedBooking.contact.email}</span>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Event Logistics</span>
                </div>
                <div>
                  • Date:{" "}
                  <span className="font-semibold text-slate-900">{selectedBooking.event.date}</span> at{" "}
                  {selectedBooking.event.time}
                </div>
                <div>
                  • Duration:{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedBooking.event.durationHours} hours
                  </span>
                </div>
                <div>
                  • Type:{" "}
                  <span className="font-semibold text-slate-900">{selectedBooking.event.eventType}</span>
                </div>
                <div>
                  • Location:{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedBooking.event.venue}, {selectedBooking.event.city}
                  </span>
                </div>
              </div>
            </div>

            {selectedBooking.contact.notes && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs space-y-1">
                <div className="font-bold text-purple-900 uppercase text-[10px]">Customer Notes & Requests:</div>
                <div className="text-slate-800 leading-relaxed">{selectedBooking.contact.notes}</div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              {selectedBooking.status !== "confirmed" && (
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, "confirmed")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  Confirm Request
                </button>
              )}

              {selectedBooking.status !== "declined" && (
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.id, "declined")}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-red-500 hover:text-white text-slate-700 font-bold text-xs transition-all"
                >
                  Decline Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
