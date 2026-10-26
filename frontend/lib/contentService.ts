import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import defaultSiteData from "../data/site.json";
import defaultLineups from "../data/lineups.json";
import defaultSoundCatalog from "../data/sound.json";
import defaultMusicians from "../data/musicians.json";
import { getAdminDb } from "./firebaseAdmin";

// Helper to resolve data directory path reliably
function getDataFilePath(filename: string): string {
  const primaryPath = path.join(process.cwd(), "data", filename);
  if (fs.existsSync(primaryPath)) return primaryPath;

  const fallbackPath = path.join(process.cwd(), "frontend", "data", filename);
  if (fs.existsSync(fallbackPath)) return fallbackPath;

  return primaryPath;
}

// 1. SITE DATA (Contact, Socials, About, Hero Cover, Clips)
export async function getSiteData() {
  const db = getAdminDb();
  if (db) {
    try {
      const doc = await db.collection("content").doc("site").get();
      const data = doc.data();
      if (doc.exists && data) {
        return { ...defaultSiteData, ...data };
      }
    } catch (e) {
      console.warn("Firestore site data fetch fallback to local:", e);
    }
  }

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
  const db = getAdminDb();
  if (db) {
    try {
      await db.collection("content").doc("site").set(data, { merge: true });
    } catch (e) {
      console.warn("Firestore sync for site content skipped/failed:", e);
    }
  }

  try {
    const filePath = getDataFilePath("site.json");
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    // Read-only filesystem in serverless environments (e.g. Vercel) is normal
  }

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
  const db = getAdminDb();
  if (db) {
    try {
      const doc = await db.collection("content").doc("lineups").get();
      const data = doc.data();
      if (doc.exists && data && Array.isArray(data.items) && data.items.length > 0) {
        return data.items;
      }
    } catch (e) {
      console.warn("Firestore lineups fetch fallback to local:", e);
    }
  }

  try {
    const filePath = getDataFilePath("lineups.json");
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Error reading lineups.json from disk:", err);
  }
  return defaultLineups;
}

export async function saveLineupsData(data: any) {
  const db = getAdminDb();
  if (db) {
    try {
      await db.collection("content").doc("lineups").set({ items: data }, { merge: true });
    } catch (e) {
      console.warn("Firestore sync for lineups skipped/failed:", e);
    }
  }

  try {
    const filePath = getDataFilePath("lineups.json");
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    // Read-only filesystem on Vercel is expected
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
  const db = getAdminDb();
  if (db) {
    try {
      const doc = await db.collection("content").doc("sound").get();
      const data = doc.data();
      if (doc.exists && data && Array.isArray(data.items) && data.items.length > 0) {
        return data.items;
      }
    } catch (e) {
      console.warn("Firestore sound fetch fallback to local:", e);
    }
  }

  try {
    const filePath = getDataFilePath("sound.json");
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Error reading sound.json from disk:", err);
  }
  return defaultSoundCatalog;
}

export async function saveSoundData(data: any) {
  const db = getAdminDb();
  if (db) {
    try {
      await db.collection("content").doc("sound").set({ items: data }, { merge: true });
    } catch (e) {
      console.warn("Firestore sync for sound skipped/failed:", e);
    }
  }

  try {
    const filePath = getDataFilePath("sound.json");
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    // Read-only filesystem on Vercel is expected
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
  const db = getAdminDb();
  if (db) {
    try {
      const doc = await db.collection("content").doc("musicians").get();
      const data = doc.data();
      if (doc.exists && data && Array.isArray(data.items) && data.items.length > 0) {
        return data.items;
      }
    } catch (e) {
      console.warn("Firestore musicians fetch fallback to local:", e);
    }
  }

  try {
    const filePath = getDataFilePath("musicians.json");
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Error reading musicians.json from disk:", err);
  }
  return defaultMusicians;
}

export async function saveMusiciansData(data: any) {
  const db = getAdminDb();
  if (db) {
    try {
      await db.collection("content").doc("musicians").set({ items: data }, { merge: true });
    } catch (e) {
      console.warn("Firestore sync for musicians skipped/failed:", e);
    }
  }

  try {
    const filePath = getDataFilePath("musicians.json");
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    // Read-only filesystem on Vercel is expected
  }

  try {
    revalidatePath("/live-band");
    revalidatePath("/admin");
  } catch (e) {
    console.warn("Revalidation warning:", e);
  }

  return data;
}
