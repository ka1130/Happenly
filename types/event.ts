export type EventCategory =
  | 'CONCERT'
  | 'WORKSHOP'
  | 'MEETUP'
  | 'CONFERENCE'
  | 'TECH'
  | 'CULTURE_TECH';

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string, tylko dzień
  startAt: string; // ISO string
  endAt: string; // ISO string
  location: string;
  capacity: number;
  registrations: number;
  category: EventCategory;
  published: boolean; // draft: false, published: true
  image: string;
};
