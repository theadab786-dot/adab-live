"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Maximize2,
  X,
  Loader2,
  Image as ImageIcon,
  Folder,
  RefreshCw,
} from "lucide-react";

interface MediaItem {
  url: string;
  name: string;
  folder: string;
}

export function MediaGalleryTab() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/upload");
      const data = await res.json();
      if (data.success) {
        setImages(data.images || []);
      }
    } catch (err) {
      console.error("Failed to load media gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload handler
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
      }
      await fetchImages();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Delete handler
  const handleDelete = async (url: string) => {
    if (!url.startsWith("/uploads/")) {
      alert("Built-in system template images cannot be deleted from the media manager.");
      return;
    }

    if (confirm("Are you sure you want to delete this photo from your uploads?")) {
      try {
        const res = await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (data.success) {
          setImages((prev) => prev.filter((img) => img.url !== url));
        } else {
          alert(data.error || "Failed to delete image.");
        }
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }
  };

  // Copy link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Filter
  const filteredImages = images.filter((img) => {
    if (activeFolder === "all") return true;
    return img.folder.toLowerCase().includes(activeFolder.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            <span>Central Photo & Media Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse, upload, and manage all photos across the site. Copy photo URLs to use them anywhere.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleUpload(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={fetchImages}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh image gallery"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Photos</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFolder("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeFolder === "all"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Photos ({images.length})
        </button>

        <button
          onClick={() => setActiveFolder("uploads")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeFolder === "uploads"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Your Uploads ({images.filter((i) => i.folder === "Uploads").length})
        </button>

        <button
          onClick={() => setActiveFolder("lineups")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeFolder === "lineups"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Band Lineups ({images.filter((i) => i.folder.includes("Lineup")).length})
        </button>

        <button
          onClick={() => setActiveFolder("sound")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeFolder === "sound"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Sound Gear ({images.filter((i) => i.folder.includes("Sound")).length})
        </button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Scanning photos...</span>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white border border-slate-200/80 space-y-3">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No photos in this folder</h3>
          <p className="text-xs text-slate-400">Upload a new photo to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={img.url}
                  alt={img.name}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(img.url)}
                    className="p-2 rounded-lg bg-white/90 text-slate-800 hover:bg-white transition-colors"
                    title="Enlarge preview"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(img.url)}
                    className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === img.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {img.url.startsWith("/uploads/") && (
                    <button
                      type="button"
                      onClick={() => handleDelete(img.url)}
                      className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Meta details */}
              <div className="p-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-800 truncate" title={img.name}>
                    {img.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{img.folder}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyLink(img.url)}
                  className="p-1.5 text-slate-400 hover:text-purple-600 rounded-md hover:bg-slate-50 transition-colors shrink-0"
                  title="Copy link"
                >
                  {copiedUrl === img.url ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full h-[75vh] rounded-3xl overflow-hidden shadow-2xl bg-black">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={previewImage}
              alt="Enlarged photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
