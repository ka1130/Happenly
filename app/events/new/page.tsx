'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // App Router

export default function NewEventPage() {
  const router = useRouter();

  // TODO check Event type for duplicates
  const initialForm = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
    registrations: 0,
    category: '',
    active: false,
  };

  const [form, setForm] = useState(initialForm);

  // TODO make one custom hook to fetch events?
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(text);
      return;
    }

    // TODO check why event isn't created
    const data = await res.json();
    console.log('Created event:', data);

    // 1️⃣ Reset form
    setForm(initialForm);

    // 2️⃣ Redirect to events list page
    router.push('/events');
  };

  return (
    <>
      <h1>Create a new event</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4"
      >
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-sm font-medium text-gray-700">
          Capacity
        </label>
        <input
          type="number"
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: Number(e.target.value) })
          }
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-sm font-medium text-gray-700">
          Registrations
        </label>
        <input
          type="number"
          value={form.registrations}
          onChange={(e) =>
            setForm({ ...form, registrations: Number(e.target.value) })
          }
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="mt-2 inline-flex items-center space-x-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="h-5 w-5 text-blue-600 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 appearance-none checked:bg-blue-600 checked:border-blue-600"
          />
          <span>Active</span>
        </label>
        <button
          type="submit"
          className="w-full mt-2  bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Create Event
        </button>
      </form>
    </>
  );
}
