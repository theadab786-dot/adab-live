import React from "react";
import type { Metadata } from "next";
import { getSoundData, getSiteData } from "@/lib/contentService";
import { SoundSetupClient } from "./SoundSetupClient";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();
  return {
    title: `Sound Setups & Audio Engineering | ${siteData.bandName}`,
    description: `Tailored PA sound equipment setups, line arrays, cordless mics, and audio engineers for intimate gatherings up to 250+ outdoor concerts.`,
  };
}

export default async function SoundSetupPage() {
  const soundCatalog = await getSoundData();
  return <SoundSetupClient soundCatalog={soundCatalog} />;
}
