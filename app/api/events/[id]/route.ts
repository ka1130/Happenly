import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
  context: { params: Promise<Params> },
) {
  const { id } = await context.params;
  const data = await req.json();

  const { error } = await supabase.from("events").update(data).eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ updated: true });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<Params> },
) {
  const { id } = await context.params;

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return new NextResponse(null, { status: 204 });
}
