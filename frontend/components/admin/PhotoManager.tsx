"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Star,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Maximize2,
  X,
} from "lucide-react";

interface PhotoManagerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  title?: string;
  description?: string;
  singlePhoto?: boolean;
}

export function PhotoManager({
  photos = [],
  onChange,
  title = "Photos & Media",
  description = "Upload high quality images (JPG, PNG, WebP) or paste an image link.",
  singlePhoto = false,
}: PhotoManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Handle file selection and upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Client-side file size check (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`"${file.name}" is larger than 10MB. Please use a compressed image.`);
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to upload file.");
        }

        newUrls.push(data.url);

        if (singlePhoto) break;
      }

      if (singlePhoto) {
        onChange([newUrls[0]]);
      } else {
        onChange([...photos, ...newUrls]);
      }

      setSuccessMessage(
        newUrls.length === 1
          ? "Photo uploaded successfully!"
          : `${newUrls.length} photos uploaded successfully!`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload photo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Add photo via direct URL
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const url = urlInput.trim();

    if (singlePhoto) {
      onChange([url]);
    } else {
      onChange([...photos, url]);
    }

    setUrlInput("");
    setShowUrlInput(false);
    setSuccessMessage("Photo URL added successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Delete / Remove photo
  const handleDeletePhoto = async (indexToDelete: number) => {
    const photoToDelete = photos[indexToDelete];
    const updated = photos.filter((_, idx) => idx !== indexToDelete);
    onChange(updated);

    // If it was uploaded into /uploads/, also delete it from server disk
    if (photoToDelete && photoToDelete.startsWith("/uploads/")) {
      try {
        await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: photoToDelete }),
        });
      } catch (e) {
        console.warn("Could not delete file from disk:", e);
      }
    }

    setSuccessMessage("Photo removed successfully.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Set photo as Cover (move to index 0)
  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    const item = photos[index];
    const rest = photos.filter((_, idx) => idx !== index);
    onChange([item, ...rest]);
    setSuccessMessage("Cover photo updated!");
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  return (
    <div className="space-y-4 rounded-2xl bg-slate-50/80 p-5 border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            multiple={!singlePhoto}
            className="hidden"
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Photo</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Paste Link</span>
          </button>
        </div>
      </div>

      {/* URL Input Box */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-purple-200 animate-in fade-in">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image link: https://example.com/photo.jpg"
            className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Notifications */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white/50 group"
        >
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-slate-800 mt-3">No photos selected yet</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Click here to choose an image from your computer or phone
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="group relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs"
            >
              <Image
                src={photo}
                alt={`Photo ${idx + 1}`}
                fill
                sizes="200px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Cover Badge for first item */}
              {idx === 0 && (
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Cover Photo</span>
                </div>
              )}

              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                {/* Enlarge preview */}
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(photo)}
                  className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white transition-colors"
                  title="View full image"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Make Cover Photo */}
                {!singlePhoto && idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetAsCover(idx)}
                    className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    title="Set as Cover Photo"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Delete / Remove Photo */}
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(idx)}
                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  title="Delete this photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Quick Add Card */}
          {!singlePhoto && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-36 rounded-xl border-2 border-dashed border-slate-200 hover:border-purple-400 bg-white hover:bg-purple-50/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-500 hover:text-purple-600"
            >
              <Plus className="w-6 h-6" />
              <span className="text-[11px] font-bold">Add Photo</span>
            </div>
          )}
        </div>
      )}

      {/* Lightbox / Full Preview Modal */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative max-w-3xl w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl bg-black">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={previewPhoto}
              alt="Photo Preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
