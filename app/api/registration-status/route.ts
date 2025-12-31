// pages/api/registration-status.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { eventId, userId } = await req.json();
    if (!eventId || !userId)
      return NextResponse.json(
        { error: "Missing eventId or userId" },
        { status: 400 },
      );

    const { data: existing } = await supabaseAdmin
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle();

    const { data: allRegs } = await supabaseAdmin
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId);

    return NextResponse.json({
      registered: Boolean(existing),
      registrations: allRegs?.length ?? 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed" },
      { status: 500 },
    );
  }
}
