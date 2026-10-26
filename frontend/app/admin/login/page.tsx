"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ShieldLock, KeyRound, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Try Firebase Auth sign-in
      if (auth) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (firebaseErr: any) {
          // If Firebase is not configured or in dev mock mode, check dev credentials fallback
          const devEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "owner@adablive.com";
          const devPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "SOHANA@2026";

          if (email.toLowerCase() === devEmail.toLowerCase() && password === devPass) {
            // Local dev authentication success
          } else {
            throw new Error(firebaseErr.message || "Invalid owner email or password.");
          }
        }
      }

      // Store local auth cookie for route protection
      document.cookie = "adab_admin_authenticated=true; path=/; max-age=86400;";
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Sign-in failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="glass-panel bg-white p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-xl">
        <div className="text-center space-y-3">
          <div className="inline-block p-3 bg-black rounded-2xl border border-amber-500/30 shadow-lg mx-auto">
            <Image
              src="/images/logo/logo.png"
              alt="Adab Live"
              width={160}
              height={95}
              className="h-14 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Band Owner Portal</h1>
          <p className="text-xs text-slate-500">Sign in to manage booking requests & date availability</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@adablive.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-sm shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
          Dev Default Login: <span className="font-mono text-slate-700">owner@adablive.com</span> / <span className="font-mono text-slate-700">SOHANA@2026</span>
        </div>
      </div>
    </div>
  );
}
