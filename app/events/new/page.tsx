"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@lib/supabase";
import { useCurrentUser } from "@hooks/useCurrentUser";
import EventForm from "@components/EventForm";
import { type EventFormData } from "@schemas/eventSchema.ts";
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

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (file && file.size > MAX_FILE_SIZE) {
      toast.error("Image too large (max 2MB)");
      return;
    }

    if (file && !ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, WEBP and AVIF allowed.");
      return;
    }

    try {
      let imageUrl = form.image;

      if (file) {
        const filePath = `events/${crypto.randomUUID()}`;

        const { data, error } = await supabase.storage
          .from("event-images")
          .upload(filePath, file, { contentType: file.type });

        if (error) {
          toast.error(error.message);
          return;
        }

        const { data: publicUrl } = supabase.storage
          .from("event-images")
          .getPublicUrl(data.path);

        imageUrl = publicUrl.publicUrl;
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
