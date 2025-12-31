import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const { eventId, userId } = await req.json();
  if (!eventId || !userId)
    return NextResponse.json(
      { error: "Missing eventId or userId" },
      { status: 400 },
    );

  const { data, error } = await supabaseAdmin
    .from("event_registrations")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .select();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}
