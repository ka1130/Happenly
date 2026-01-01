"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EventForm from "@components/EventForm";
import { type EventFormData } from "@schemas/eventSchema.ts";

export default function EditEventPage() {
  const [form, setForm] = useState<EventFormData | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      const res = await fetch(`/api/events/${id}`);

      const data = await res.json();

      setForm({
        title: data.title,
        description: data.description,
        date: data.date,
        startAt: data.startAt.split("T")[1],
        endAt: data.endAt.split("T")[1],
        location: data.location,
        capacity: data.capacity,
        registrations: data.registrations,
        category: data.category,
        published: data.published,
        image: data.image,
      });
    };

    fetchEvent();
  }, [id]);

  const handleSubmitAction = async (form: EventFormData, file: File | null) => {
    let imageUrl = form.image;

    if (file) {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      imageUrl = data.url;
    }

    const payload = {
      ...form,
      startAt: `${form.date} ${form.startAt}`,
      endAt: `${form.date} ${form.endAt}`,
      capacity: Number(form.capacity),
      registrations: Number(form.registrations),
      published: Boolean(form.published),
      image: imageUrl,
    };

    await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  if (!form) return <p>Loading…</p>;

  return (
    <div>
      <EventForm
        submitLabel="Update Event"
        initialData={form}
        onSubmitAction={handleSubmitAction}
      />
    </div>
  );
}
