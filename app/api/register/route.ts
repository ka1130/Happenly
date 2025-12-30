// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { eventId, userId } = await req.json();

    console.log("POST /api/register:", { eventId, userId }); // ← tutaj log

    const { data, error } = await supabaseAdmin
      .from("event_registrations")
      .insert({ event_id: eventId, user_id: userId })
      .select();

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json(
      { error: { message: err.message } },
      { status: 500 },
    );
  }
}
