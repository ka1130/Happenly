import { NextRequest, NextResponse } from 'next/server';
import { events, Event } from '@data/events';

export async function GET(req: NextRequest) {
  console.log('EVENTS', events);
  return NextResponse.json(events);
}
