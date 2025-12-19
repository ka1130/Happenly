export default async function Dashboard() {
  const res = await fetch('http://localhost:3000/api/events');
  const events = await res.json();

  type Event = {
    active: boolean;
    registrations: number;
    [key: string]: any;
  };

  const totalEvents = (events as Event[]).length;
  const activeEvents = (events as Event[]).filter(
    (e: Event) => e.active
  ).length;
  const totalRegistrations = (events as Event[]).reduce(
    (sum: number, e: Event) => sum + e.registrations,
    0
  );

  return (
    <div>
      <div>Total Events: {totalEvents}</div>
      <div>Active Events: {activeEvents}</div>
      <div>Total Registrations: {totalRegistrations}</div>
    </div>
  );
}
