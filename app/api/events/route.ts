import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'events.json');

export async function GET() {
  const data = await fs.readFile(filePath, 'utf-8');
  const events = JSON.parse(data);
  return new Response(JSON.stringify(events), { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();

  const data = await fs.readFile(filePath, 'utf-8');
  const events = JSON.parse(data);

  const newEvent = { ...body, id: Date.now().toString() };
  events.push(newEvent);

  await fs.writeFile(filePath, JSON.stringify(events, null, 2));

  return new Response(JSON.stringify(newEvent), { status: 201 });
}
