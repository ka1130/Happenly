"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DocumentPlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import EventForm, { type EventFormData } from "@components/EventForm";

const EVENT_CATEGORIES = [
  { value: "CONCERT", label: "Concert" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "MEETUP", label: "Meetup" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "TECH", label: "Tech" },
  { value: "CULTURE_TECH", label: "Culture-tech" },
] as const;

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

  const handleSubmitAction = async (form: EventFormData, file: File | null) => {
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

    setForm(initialForm);
    setFile(null);
  };

  return (
    <div className="w-full">
      <h3 className="mb-2 text-2xl font-semibold">Create Event</h3>
      <p className="mb-10">Fill in the details to create a new event</p>
      <EventForm
        submitLabel="Create Event"
        initialData={form}
        onSubmitAction={handleSubmitAction}
      />
    </div>
  );
}
