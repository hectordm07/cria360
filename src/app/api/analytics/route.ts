import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedEvents = new Set(["page_view", "cta_click"]);
const allowedDevices = new Set(["mobile", "tablet", "desktop", "unknown"]);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const eventName = String(payload?.eventName ?? "");
    const path = String(payload?.path ?? "").slice(0, 500);
    const referrerHost = payload?.referrerHost ? String(payload.referrerHost).slice(0, 180) : null;
    const deviceType = allowedDevices.has(String(payload?.deviceType)) ? String(payload.deviceType) : "unknown";

    if (!allowedEvents.has(eventName) || !path.startsWith("/")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("site_analytics_events").insert({
      event_name: eventName,
      path,
      referrer_host: referrerHost,
      device_type: deviceType,
    });

    if (error) return NextResponse.json({ ok: false }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
