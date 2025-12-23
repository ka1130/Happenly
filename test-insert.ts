import "dotenv/config";
import { supabase } from "./lib/supabase";

async function test() {
  const { data, error } = await supabase.from("events").insert([
    {
      title: "Digital Art Expo",
      description: "Showcase of digital and generative art.",
      date: "2026-02-05T00:00:00Z",
      startAt: "2026-02-05T10:00:00Z",
      endAt: "2026-02-05T18:00:00Z",
      location: "London",
      capacity: 120,
      registrations: 70,
      category: "CULTURE_TECH",
      published: false,
      image:
        "https://images.stockcake.com/public/a/c/1/ac143f91-28ad-4cb8-9387-d149032bbdf5_large/future-on-display-stockcake.jpg",
    },
  ]);
  console.log({ data, error });
}

test();
