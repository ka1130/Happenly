import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type Params = { id: string };

export async function GET(
  _req: NextRequest,
  context: { params: Promise<Params> },
) {
  const { id } = await context.params;

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }, // jeśli Next.js mówi, że params jest Promise
) {
  const { id } = await context.params; // <--- trzeba zrobić await
  const data = await req.json();

  const payload = {
    ...data,
    capacity: Number(data.capacity),
    registrations: Number(data.registrations),
    published: Boolean(data.published),
  };

  const { data: updated, error } = await supabaseAdmin
    .from("events")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) {
    console.log("PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ updated });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<Params> },
) {
  const { id } = await context.params;

  const { count, error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (count === 0) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
