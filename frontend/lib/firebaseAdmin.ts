import { initializeApp, getApps, cert, getApp, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App | undefined;
let adminDbInstance: Firestore | null = null;
let adminAuthInstance: Auth | null = null;

if (!getApps().length) {
  try {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "adab-live";

    if (clientEmail && rawKey) {
      let privateKey = rawKey.trim();
      // Strip surrounding quotes if user copied them into Vercel UI
      if (
        (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
        (privateKey.startsWith("'") && privateKey.endsWith("'"))
      ) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, "\n");

      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      adminDbInstance = getFirestore(app);
      adminAuthInstance = getAuth(app);
    }
  } catch (error) {
    console.warn("Firebase Admin credentials setup skipped or failed:", error);
  }
} else {
  try {
    app = getApp();
    adminDbInstance = getFirestore(app);
    adminAuthInstance = getAuth(app);
  } catch (err) {
    console.warn("Firebase Admin getApp fallback failed:", err);
  }
}

export const adminDb = adminDbInstance;
export const adminAuth = adminAuthInstance;

