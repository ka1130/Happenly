export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  // TODO combine into one datetime object
  time?: string;
  location: string;
  capacity: number;
  registrations: number;
  category: string;
  active: boolean;
};

// TODO change model, there should be Published, Draft and Full options
