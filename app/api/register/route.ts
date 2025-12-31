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

    if (existing)
      return NextResponse.json(
        { error: "Already registered" },
        { status: 400 },
      );

    const { data, error } = await supabaseAdmin
      .from("event_registrations")
      .insert({ event_id: eventId, user_id: userId })
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Register failed" },
      { status: 500 },
    );
  }
}
