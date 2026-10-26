import { NextRequest, NextResponse } from "next/server";
import {
  getSiteData,
  saveSiteData,
  getLineupsData,
  saveLineupsData,
  getSoundData,
  saveSoundData,
  getMusiciansData,
  saveMusiciansData,
} from "@/lib/contentService";
import defaultSiteData from "@/data/site.json";
import defaultLineups from "@/data/lineups.json";
import defaultSoundCatalog from "@/data/sound.json";
import defaultMusicians from "@/data/musicians.json";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "site") {
      const data = await getSiteData();
      return NextResponse.json({ success: true, data });
    }
    if (type === "lineups") {
      const data = await getLineupsData();
      return NextResponse.json({ success: true, data });
    }
    if (type === "sound") {
      const data = await getSoundData();
      return NextResponse.json({ success: true, data });
    }
    if (type === "musicians") {
      const data = await getMusiciansData();
      return NextResponse.json({ success: true, data });
    }

    // Default: return all
    const [site, lineups, sound, musicians] = await Promise.all([
      getSiteData(),
      getLineupsData(),
      getSoundData(),
      getMusiciansData(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        site: site || defaultSiteData,
        lineups: lineups && lineups.length > 0 ? lineups : defaultLineups,
        sound: sound && sound.length > 0 ? sound : defaultSoundCatalog,
        musicians: musicians && musicians.length > 0 ? musicians : defaultMusicians,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/content error:", error);
    // Never fail with 500; gracefully return defaults so the owner dashboard remains functional
    return NextResponse.json({
      success: true,
      warning: "Loaded fallback catalog data due to server error",
      data: {
        site: defaultSiteData,
        lineups: defaultLineups,
        sound: defaultSoundCatalog,
        musicians: defaultMusicians,
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Basic auth check via cookie
    const authCookie = request.cookies.get("adab_admin_authenticated")?.value;
    if (authCookie !== "true") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: "Missing required 'type' or 'data'" },
        { status: 400 }
      );
    }

    let updated;
    switch (type) {
      case "site":
        updated = await saveSiteData(data);
        break;
      case "lineups":
        if (!Array.isArray(data)) {
          return NextResponse.json(
            { success: false, error: "Lineups data must be an array" },
            { status: 400 }
          );
        }
        updated = await saveLineupsData(data);
        break;
      case "sound":
        if (!Array.isArray(data)) {
          return NextResponse.json(
            { success: false, error: "Sound data must be an array" },
            { status: 400 }
          );
        }
        updated = await saveSoundData(data);
        break;
      case "musicians":
        if (!Array.isArray(data)) {
          return NextResponse.json(
            { success: false, error: "Musicians data must be an array" },
            { status: 400 }
          );
        }
        updated = await saveMusiciansData(data);
        break;
      default:
        return NextResponse.json(
          { success: false, error: `Invalid content type '${type}'` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved and updated ${type} information!`,
      data: updated,
    });
  } catch (error: any) {
    console.error("POST /api/admin/content error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save content" },
      { status: 500 }
    );
  }
}
