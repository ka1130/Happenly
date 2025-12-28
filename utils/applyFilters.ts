import { Event, EventCategory } from "@apptypes/event";

export function applyFilters(
  events: Event[] | null,
  search: string,
  category: EventCategory | "",
  status: string,
  sort: string,
) {
  if (!events) return [];

  return [...events]
    .filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.description?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchesCategory = category ? e.category === category : true;

      let matchesStatus = true;
      if (status === "published") matchesStatus = e.published;
      else if (status === "draft") matchesStatus = !e.published;
      else if (status === "past") matchesStatus = new Date(e.date) < new Date();

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "attendees-desc":
          return (b.registrations ?? 0) - (a.registrations ?? 0);
        case "title-asc":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
}
