import { NextRequest, NextResponse } from "next/server";
import { events } from "@data/events";

type Params = {
  id: string;
};

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  // TU docelowo będzie baza / serwis
  // const event = await db.event.findById(id)

  return NextResponse.json({
    id,
    status: "TODO: fetch from database",
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const data = await req.json();

  // TODO: update event by id with partial data

  return NextResponse.json({
    id,
    updated: data,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Params },
) {
  const { id } = params;
  const index = events.findIndex((event) => event.id === params.id);
  if (index === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  events.splice(index, 1);

  return NextResponse.json(null, { status: 204 });
}
