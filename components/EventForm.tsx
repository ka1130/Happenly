"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentPlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const EVENT_CATEGORIES = [
  { value: "CONCERT", label: "Concert" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "MEETUP", label: "Meetup" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "TECH", label: "Tech" },
  { value: "CULTURE_TECH", label: "Culture-tech" },
] as const;

export type EventFormData = {
  title: string;
  description: string;
  date: string;
  startAt: string;
  endAt: string;
  location: string;
  capacity: number;
  registrations: number;
  category: string;
  published: boolean;
  image: string;
};

type Props = {
  initialData: EventFormData;
  submitLabel: string;
  onSubmitAction: (data: EventFormData, file: File | null) => Promise<void>;
};

export default function EventForm({
  initialData,
  submitLabel,
  onSubmitAction,
}: Props) {
  const [form, setForm] = useState(initialData);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmitAction(form, file);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-4 rounded-md bg-stone-50 p-4 shadow"
    >
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">{submitLabel}</h3>
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          <span>{form.published ? "Published" : "Draft"}</span>
        </label>
      </div>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full rounded border px-3 py-2"
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full rounded border px-3 py-2"
      />

      <div className="flex gap-4">
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="flex-1 rounded border px-3 py-2"
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="flex-1 rounded border px-3 py-2"
        >
          <option value="" disabled>
            Category
          </option>
          {EVENT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <input
          type="time"
          value={form.startAt}
          onChange={(e) => setForm({ ...form, startAt: e.target.value })}
          className="flex-1 rounded border px-3 py-2"
        />
        <input
          type="time"
          value={form.endAt}
          onChange={(e) => setForm({ ...form, endAt: e.target.value })}
          className="flex-1 rounded border px-3 py-2"
        />
      </div>

      <input
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="number"
        placeholder="Capacity"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded bg-blue-500 py-2 text-white"
      >
        <DocumentPlusIcon className="h-4 w-4" />
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
