import React from "react";
import type { Metadata } from "next";
import { getSiteData } from "@/lib/contentService";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "../../components/SocialIcons";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();
  return {
    title: `Contact & Booking Enquiries | ${siteData.bandName}`,
    description: `Get in touch with ${siteData.bandName} for live band bookings, custom ensemble inquiries, or pro audio sound equipment consultation.`,
  };
}

export default async function ContactPage() {
  const siteData = await getSiteData();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-display">Get In Touch</h1>
        <p className="text-slate-600">Have questions before booking? Contact our team directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-display">Contact Information</h2>
          <div className="space-y-4 text-slate-600 text-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Phone / Call</div>
                <div className="text-base font-semibold text-slate-900">{siteData.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">WhatsApp Direct</div>
                <a
                  href={`https://wa.me/${siteData.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-semibold text-purple-600 hover:underline"
                >
                  Message on WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Email Inquiries</div>
                <div className="text-base font-semibold text-slate-900">{siteData.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Base Location</div>
                <div className="text-base font-semibold text-slate-900">{siteData.address}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-display">Social Channels</h2>
          <p className="text-slate-600 text-sm">
            Follow our live performances, behind-the-scenes stage setups, and acoustic sound clips across social media.
          </p>
          <div className="space-y-3">
            {siteData.socials?.instagram && (
              <a
                href={siteData.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-500/40 text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <InstagramIcon className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-sm">Instagram</span>
                </div>
                <span className="text-xs text-slate-500">Follow on Instagram</span>
              </a>
            )}

            {siteData.socials?.youtube && (
              <a
                href={siteData.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-500/40 text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <YoutubeIcon className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-sm">YouTube Channel</span>
                </div>
                <span className="text-xs text-slate-500">Watch Live Clips</span>
              </a>
            )}

            {siteData.socials?.facebook && (
              <a
                href={siteData.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-500/40 text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FacebookIcon className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-sm">Facebook Page</span>
                </div>
                <span className="text-xs text-slate-500">Connect on Facebook</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
