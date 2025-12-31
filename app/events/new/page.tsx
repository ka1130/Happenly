"use client";

import { useState } from "react";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { supabase } from "@lib/supabase";
import { useCurrentUser } from "@hooks/useCurrentUser";
import EventForm, { type EventFormData } from "@components/EventForm";
import SignInPrompt from "@components/SignInPrompt";

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
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);

  const { user, loading } = useCurrentUser();

  const handleSubmitAction = async (form: EventFormData, file: File | null) => {
    if (!user) {
      toast.error("User not logged in");
      return;
    }

    try {
      let imageUrl = form.image;

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

      const startTimestamp = `${form.date} ${form.startAt}:00`;
      const endTimestamp = `${form.date} ${form.endAt}:00`;

      const payload = {
        ...form,
        startAt: startTimestamp,
        endAt: endTimestamp,
        image: imageUrl,
        user_id: user.id,
      };

      const { data, error } = await supabase.from("events").insert([payload]);

      if (error) {
        toast.error(`Cannot create event: ${error.message}`);
        return;
      }

      toast.success("Event created successfully!");
      setForm(initialForm);
      setFile(null);
    } catch (err: any) {
      toast.error(`Unexpected error: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) {
    return <p className="py-10 text-center">Loading…</p>;
  }

  if (!user) {
    return <SignInPrompt redirectTo="/events/new" />;
  }

  return (
    <>
      <Head>
        <title>Add Event – Happenly</title>
      </Head>
      <div className="w-full">
        <h3 className="mb-2 text-2xl font-semibold">Create Event</h3>
        <p className="mb-10">Fill in the details to create a new event</p>
        <EventForm
          submitLabel="Create Event"
          initialData={form}
          onSubmitAction={handleSubmitAction}
        />
      </div>
    </>
  );
}
