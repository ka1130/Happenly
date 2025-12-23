"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();

  const initialForm = {
    title: "",
    description: "",
    date: "",
    startAt: "",
    endAt: "",
    location: "",
    capacity: 0,
    registrations: 0,
    category: "",
    published: false,
    image: "",
  };

  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = form.image;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        imageUrl = data.url;
      }

      const startTimestamp = `${form.date} ${form.startAt}:00`;
      const endTimestamp = `${form.date} ${form.endAt}:00`;

      const payload = {
        ...form,
        startAt: startTimestamp,
        endAt: endTimestamp,
        image: imageUrl,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        return;
      }

      const data = await res.json();
      console.log("Created event:", data);

      // 1️⃣ Reset form
      setForm(initialForm);
      setFile(null);

      // 2️⃣ Redirect to events list page
      router.push("/events");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="mb-2 text-2xl font-semibold">Create Event</h3>
      <p className="mb-6">Fill in the details to create a new event</p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-xl space-y-4 rounded-md border-stone-100 bg-stone-50 p-4 shadow"
      >
        <div className="flex justify-between">
          <h6>Create Event</h6>
          <label className="inline-flex cursor-pointer items-center gap-3">
            <input type="checkbox" className="peer sr-only" />

            <div className="relative h-6 w-11 rounded-full bg-stone-300 transition-colors peer-checked:bg-blue-500">
              <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-in-out peer-checked:translate-x-5" />
            </div>

            <span className="text-sm font-medium text-stone-700">Draft</span>
          </label>
        </div>
        <label className="block text-sm font-medium text-stone-700">
          Title
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <label className="block text-sm font-medium text-stone-700">
          Description
        </label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <label className="block text-sm font-medium text-stone-700">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <label className="block text-sm font-medium text-stone-700">
          startAt
        </label>
        <input
          type="time"
          value={form.startAt}
          onChange={(e) => setForm({ ...form, startAt: e.target.value })}
          className="mt-1 block w-full rounded border border-stone-300 px-3 py-2"
        />
        <label className="block text-sm font-medium text-stone-700">
          endAt
        </label>
        <input
          type="time"
          value={form.endAt}
          onChange={(e) => setForm({ ...form, endAt: e.target.value })}
          className="mt-1 block w-full rounded border border-stone-300 px-3 py-2"
        />
        <label className="block text-sm font-medium text-stone-700">
          Location
        </label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <label className="block text-sm font-medium text-stone-700">
          Capacity
        </label>
        <input
          type="number"
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: Number(e.target.value) })
          }
          className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <label className="block text-sm font-medium text-stone-700">
          Registrations
        </label>
        <input
          type="number"
          value={form.registrations}
          onChange={(e) =>
            setForm({ ...form, registrations: Number(e.target.value) })
          }
          className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <label className="block text-sm font-medium text-stone-700">
          Category
        </label>
        <input
          type="text"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="mt-1 block w-full rounded border border-stone-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <label className="mt-2 inline-flex items-center space-x-2 text-sm font-medium text-stone-700">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="h-5 w-5 appearance-none rounded border border-stone-300 text-blue-600 checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span>published</span>
        </label>
        <label className="block text-sm font-medium text-stone-700">
          Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
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
            className="mt-1 flex h-32 w-full cursor-pointer items-center justify-center rounded border-2 border-dashed border-stone-300 bg-stone-50 text-stone-500 transition hover:border-blue-500 hover:bg-blue-50"
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

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 w-full rounded py-2 text-white transition ${
            loading ? "bg-stone-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Submitting..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
