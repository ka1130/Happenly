import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    date: z.string().min(1, "Date is required"),
    startAt: z.string().min(1, "Start time is required"),
    endAt: z.string().min(1, "End time is required"),
    location: z.string().min(1, "Location is required"),
    capacity: z.number().min(1, "Capacity must be greater than 0"),
    category: z.string().min(1, "Category is required"),
    registrations: z.number(),
    published: z.boolean(),
    image: z.string().optional(),
  })
  .refine((data) => data.startAt < data.endAt, {
    message: "End time must be after start time",
    path: ["endAt"],
  });

export type EventFormData = z.infer<typeof eventSchema>;
