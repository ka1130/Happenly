"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { supabase } from "@lib/supabase";
import EventForm, { type EventFormData } from "@components/EventForm";

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

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const handleSubmitAction = async (form: EventFormData, file: File | null) => {
    try {
      let imageUrl = form.image;

      // Upload pliku jeśli istnieje
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const text = await res.text();
          toast.error(`Image upload failed: ${text}`);
          return;
        }

        const data = await res.json();
        imageUrl = data.url;
      }

      // Timestampy
      const startTimestamp = `${form.date} ${form.startAt}:00`;
      const endTimestamp = `${form.date} ${form.endAt}:00`;

      // Payload z user_id
      const payload = {
        ...form,
        startAt: startTimestamp,
        endAt: endTimestamp,
        image: imageUrl,
        user_id: user.id, // UID zalogowanego użytkownika
      };

      // Wstawienie bezpośrednio do Supabase JS
      const { data, error } = await supabase.from("events").insert([payload]);

      if (error) {
        toast.error(`Cannot create event: ${error.message}`);
        return;
      }

      toast.success("Event created successfully!");
      setForm(initialForm);
      setFile(null);
      router.push("/my-events"); // przekierowanie po sukcesie
    } catch (err: any) {
      toast.error(`Unexpected error: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading…</p>;
  }

  if (!user) {
    return (
      <div className="py-10 text-center text-stone-600">
        <h3 className="mb-2 text-xl font-semibold">Sign in required</h3>
        <p className="mb-6">You must be logged in to create an event.</p>
        <button
          onClick={() => router.push("/auth?mode=signIn&redirect=/events/new")}
          className="cursor-pointer rounded-md bg-blue-500 px-4 py-1.5 text-white"
        >
          Sign in
        </button>
      </div>
    );
  }

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
