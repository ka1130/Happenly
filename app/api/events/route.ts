import { NextRequest, NextResponse } from 'next/server';
import { events, Event } from '@data/events';

export async function GET(req: NextRequest) {
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newEvent: Event = { ...body, id: Date.now().toString() };
  events.push(newEvent);
  return NextResponse.json(newEvent, { status: 201 });
}
