import { NextRequest, NextResponse } from 'next/server';
import { events, Event } from '@data/events';

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// export async function GET(req: NextRequest, context: Context) {
//   //
//   console.log('context', context);
//   // const {id}

//   // const event = events.find((e) => e.id === context.params.id);

//   // if (!event) {
//   //   return NextResponse.json({ error: 'Not found' }, { status: 404 });
//   // }

//   return NextResponse.json(event);
// }

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/events/[id]'>
) {
  const { id } = await ctx.params;

  // TU docelowo będzie baza / serwis
  // const event = await db.event.findById(id)

  return NextResponse.json({
    id,
    status: 'TODO: fetch from database',
  });
}
