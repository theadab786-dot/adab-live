import React from "react";
import type { Metadata } from "next";
import { getLineupsData, getMusiciansData, getSiteData } from "@/lib/contentService";
import { LiveBandClient } from "./LiveBandClient";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteData();
  return {
    title: `Live Band Lineups & Ensembles | ${siteData.bandName}`,
    description: `Explore live musical formations from intimate acoustic soloists and duets to high-energy party bands for your event.`,
  };
}

export default async function LiveBandPage() {
  const [lineups, musicians] = await Promise.all([
    getLineupsData(),
    getMusiciansData(),
  ]);

  return <LiveBandClient lineups={lineups} musicians={musicians} />;
}
