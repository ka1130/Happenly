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
import Button from "@components/Button";

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

type EventFormProps = {
  initialData: EventFormData;
  submitLabel: string;
  onSubmitAction: (data: EventFormData, file: File | null) => Promise<void>;
};

export default function EventForm({
  initialData,
  submitLabel,
  onSubmitAction,
}: EventFormProps) {
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
      className="mx-auto max-w-xl space-y-4 rounded-md border-stone-100 bg-stone-50 p-4 shadow"
    >
      <div className="flex justify-between">
        <h3 className="mb-4 text-xl">{submitLabel}</h3>
        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          <span className="text-sm font-medium text-stone-700">
            {form.published ? "Published" : "Draft"}
          </span>
          <div className="relative h-6 w-11 rounded-full bg-stone-300 transition-colors peer-checked:bg-blue-500 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:after:translate-x-5" />
        </label>
      </div>

      <label className="mb-0 block text-sm font-medium text-stone-700">
        Event Title
      </label>
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <label className="mb-0 block text-sm font-medium text-stone-700">
        Description
      </label>
      <input
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <div className="items-center gap-4 md:flex">
        <div className="mb-4 flex-1 md:mb-0">
          <label className="flex gap-2 text-sm font-medium text-stone-700">
            <CalendarIcon className="h-5 w-5" />
            <span>Date</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="mb-4 flex-1 md:mb-0">
          <label className="block text-sm font-medium text-stone-700">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="" disabled>
              Select category
            </option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="flex gap-2 text-sm font-medium text-stone-700">
            <ClockIcon className="h-5 w-5" />
            <span>Start Time</span>
          </label>
          <input
            type="time"
            value={form.startAt}
            onChange={(e) => setForm({ ...form, startAt: e.target.value })}
            className="mt-1 block w-full rounded border border-stone-300 px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="flex gap-2 text-sm font-medium text-stone-700">
            <ClockIcon className="h-5 w-5" />
            <span>End Time</span>
          </label>
          <input
            type="time"
            value={form.endAt}
            onChange={(e) => setForm({ ...form, endAt: e.target.value })}
            className="mt-1 block w-full rounded border border-stone-300 px-3 py-2"
          />
        </div>
      </div>
      <label className="mb-0 flex gap-2 text-sm font-medium text-stone-700">
        <MapPinIcon className="h-5 w-5" />
        <span>Location</span>
      </label>
      <input
        type="text"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <label className="mb-0 flex gap-2 text-sm font-medium text-stone-700">
        <UsersIcon className="h-5 w-5" />
        <span>Maximum Attendees</span>
      </label>
      <input
        type="number"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
        className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <div className="mt-2">
        <label className="block text-sm font-medium text-stone-700">
          Image
        </label>
        <div
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setFile(e.dataTransfer.files[0]);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          className="mt-1 flex h-32 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed border-stone-300 bg-stone-50 text-center text-stone-500 transition hover:border-blue-500 hover:bg-blue-50"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          {file ? file.name : "Drag & drop an image here or click to select"}
        </div>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="mt-2 w-32 rounded border"
          />
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-1 flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          className={`w-full text-white transition ${
            loading ? "bg-stone-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <DocumentPlusIcon className="h-4 w-4" />
          {loading ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          className="inline-flex min-w-30 border border-gray-300 px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          onClick={() => router.push("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancel
        </Button>
      </div>
    </form>
  );
}
