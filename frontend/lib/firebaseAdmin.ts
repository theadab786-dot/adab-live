import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";
import type { App } from "firebase-admin/app";

let appInstance: App | null = null;
let adminDbInstance: Firestore | null = null;
let adminAuthInstance: Auth | null = null;
let isInitialized = false;

export function getAdminDb(): Firestore | null {
  if (isInitialized) {
    return adminDbInstance;
  }
  isInitialized = true;

  try {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "adab-live";

    if (!clientEmail || !rawKey) {
      console.warn("[Firebase Admin] Credentials not found in environment, using memory/local fallback.");
      return null;
    }

    // Dynamic require so module load never crashes the serverless runtime
    const { initializeApp, getApps, cert, getApp } = require("firebase-admin/app");
    const { getFirestore } = require("firebase-admin/firestore");

    let privateKey = rawKey.trim();
    if (
      (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
      (privateKey.startsWith("'") && privateKey.endsWith("'"))
    ) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");

    const existingApps = getApps();
    if (!existingApps.length) {
      appInstance = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      appInstance = getApp();
    }

    adminDbInstance = getFirestore(appInstance);
    return adminDbInstance;
  } catch (error) {
    console.warn("[Firebase Admin] DB initialization error (falling back to memory):", error);
    adminDbInstance = null;
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  try {
    if (adminAuthInstance) return adminAuthInstance;
    if (!appInstance) {
      getAdminDb();
    }
    if (appInstance) {
      const { getAuth } = require("firebase-admin/auth");
      adminAuthInstance = getAuth(appInstance);
    }
    return adminAuthInstance;
  } catch (error) {
    console.warn("[Firebase Admin] Auth initialization error:", error);
    return null;
  }
}

// Export adminDb getter for direct imports
export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
