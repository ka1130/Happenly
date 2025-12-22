import { PrismaClient, EventCategory } from '@prisma/client';

const prisma = new PrismaClient();

const events = [
  {
    id: '1',
    title: 'VR Art Exhibition',
    description: 'Immersive digital art.',
    date: new Date('2026-01-10'),
    startAt: new Date('2026-01-10T10:00:00Z'),
    endAt: new Date('2026-01-10T18:00:00Z'),
    location: 'Warsaw',
    capacity: 100,
    registrations: 45,
    category: EventCategory.CULTURE_TECH, // <- PRZED: string, TERAZ enum
    published: true,
  },
  {
    id: '2',
    title: 'React Workshop',
    description: 'React + Next.js workshop.',
    date: new Date('2026-01-15'),
    startAt: new Date('2026-01-15T14:00:00Z'),
    endAt: new Date('2026-01-15T17:00:00Z'),
    location: 'Online',
    capacity: 50,
    registrations: 20,
    category: EventCategory.TECH, // <- użycie enumu
    published: false,
  },
];

async function main() {
  await prisma.event.createMany({ data: events });
  console.log('Seed finished');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
