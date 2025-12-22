import { type EventCategory } from '@apptypes/event';

export function formatCategory(cat: EventCategory): string {
  return cat
    .toLowerCase()
    .replace('_', '-')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('-');
}
