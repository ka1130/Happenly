// app/api/unregister/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL Supabase
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role key (Tylko w backendzie!)
);

export async function POST(req: NextRequest) {
  try {
    const { eventId, userId } = await req.json();

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: { message: "Missing data" } },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("event_registrations")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", userId);

    if (error) {
      console.error("Unregister error:", error);
      return NextResponse.json(
        { error: { message: error.message || "Unregister failed" } },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unregister exception:", err);
    return NextResponse.json(
      { error: { message: err?.message || "Unregister failed" } },
      { status: 500 },
    );
  }
}
