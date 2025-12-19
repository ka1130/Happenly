export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registrations: number;
  category: string;
  active: boolean;
};

export let events: Event[] = [
  {
    id: '1',
    title: 'VR Art Exhibition',
    description: 'Immersive digital art.',
    date: '2026-01-10',
    location: 'Warsaw',
    capacity: 100,
    registrations: 45,
    category: 'culture-tech',
    active: true,
  },
  {
    id: '2',
    title: 'React Workshop',
    description: 'React + Next.js workshop.',
    date: '2026-01-15',
    location: 'Online',
    capacity: 50,
    registrations: 20,
    category: 'tech',
    active: false,
  },
];
