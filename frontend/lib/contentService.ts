import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import defaultSiteData from "../data/site.json";
import defaultLineups from "../data/lineups.json";
import defaultSoundCatalog from "../data/sound.json";
import defaultMusicians from "../data/musicians.json";
import { adminDb } from "./firebaseAdmin";

// Helper to resolve data directory path reliably
function getDataFilePath(filename: string): string {
  const primaryPath = path.join(process.cwd(), "data", filename);
  if (fs.existsSync(primaryPath)) return primaryPath;

  const fallbackPath = path.join(process.cwd(), "frontend", "data", filename);
  if (fs.existsSync(fallbackPath)) return fallbackPath;

  // Default to primary
  return primaryPath;
}

// 1. SITE DATA (Contact, Socials, About, Hero Cover, Clips)
export async function getSiteData() {
  try {
    const filePath = getDataFilePath("site.json");
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading site.json from disk:", err);
  }
  return defaultSiteData;
}

export async function saveSiteData(data: any) {
  const filePath = getDataFilePath("site.json");
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  // Sync to Firestore if available
  if (adminDb) {
    try {
      await adminDb.collection("content").doc("site").set(data, { merge: true });
    } catch (e) {
      console.warn("Firestore sync for site content skipped/failed:", e);
    }
  }

  // Trigger cache revalidation across pages
  try {
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/product");
    revalidatePath("/admin");
  } catch (e) {
    console.warn("Revalidation warning:", e);
  }

  return data;
}

// 2. LIVE BAND LINEUPS & PHOTOS
export async function getLineupsData() {
  try {
    const filePath = getDataFilePath("lineups.json");
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading lineups.json from disk:", err);
  }
  return defaultLineups;
}

export async function saveLineupsData(data: any) {
  const filePath = getDataFilePath("lineups.json");
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  if (adminDb) {
    try {
      await adminDb.collection("content").doc("lineups").set({ items: data }, { merge: true });
    } catch (e) {
      console.warn("Firestore sync for lineups skipped/failed:", e);
    }
  }

  try {
    revalidatePath("/");
    revalidatePath("/live-band");
    revalidatePath("/product");
    revalidatePath("/admin");
  } catch (e) {
    console.warn("Revalidation warning:", e);
  }

  return data;
}

// 3. SOUND SETUPS & EQUIPMENT & PHOTOS
export async function getSoundData() {
  try {
    const filePath = getDataFilePath("sound.json");
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading sound.json from disk:", err);
  }
  return defaultSoundCatalog;
}

export async function saveSoundData(data: any) {
  const filePath = getDataFilePath("sound.json");
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  if (adminDb) {
    try {
      await adminDb.collection("content").doc("sound").set({ items: data }, { merge: true });
    } catch (e) {
      console.warn("Firestore sync for sound skipped/failed:", e);
    }
  }

  try {
    revalidatePath("/");
    revalidatePath("/sound-setup");
    revalidatePath("/product");
    revalidatePath("/admin");
  } catch (e) {
    console.warn("Revalidation warning:", e);
  }

  return data;
}

// 4. MUSICIANS
export async function getMusiciansData() {
  try {
    const filePath = getDataFilePath("musicians.json");
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading musicians.json from disk:", err);
  }
  return defaultMusicians;
}

export async function saveMusiciansData(data: any) {
  const filePath = getDataFilePath("musicians.json");
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  if (adminDb) {
    try {
      await adminDb.collection("content").doc("musicians").set({ items: data }, { merge: true });
    } catch (e) {
      console.warn("Firestore sync for musicians skipped/failed:", e);
    }
  }

  try {
    revalidatePath("/live-band");
    revalidatePath("/admin");
  } catch (e) {
    console.warn("Revalidation warning:", e);
  }

  return data;
}
