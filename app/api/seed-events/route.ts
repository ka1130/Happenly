import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(_req: NextRequest) {
  const sampleEvents = [
    {
      title: "VR Art Exhibition",
      description:
        "Explore the cutting edge of creativity at Digital Art Expo — a vibrant showcase where technology meets artistic expression. This immersive event brings together digital artists, designers, and creative technologists to present groundbreaking works across interactive media, generative art, 3D design, and immersive experiences. Discover new tools, techniques, and ideas shaping the future of digital art, connect with visionary creators, and get inspired by how innovation is redefining visual culture.",
      date: "2026-01-10T00:00:00Z",
      startAt: "2026-01-10T10:00:00Z",
      endAt: "2026-01-10T18:00:00Z",
      location: "Warsaw",
      capacity: 100,
      registrations: 45,
      category: "CULTURE_TECH",
      published: true,
      image:
        "https://images.stockcake.com/public/0/6/0/060467c1-2440-4b8a-bcde-802f6f0259f0/vr-art-experience-stockcake.jpg",
      user_id: "11111111-2222-3333-4444-555555555555",
    },
    {
      title: "React + Next.js Workshop",
      description:
        "Join industry leaders for a full day of insights, networking, and breakthrough technologies. This premier event brings together innovators, entrepreneurs, and technology enthusiasts to explore the latest trends shaping our digital future. From AI and machine learning to sustainable tech solutions, discover what's next in the world of innovation. Connect with like-minded professionals and gain actionable insights you can apply immediately.",
      date: "2026-01-15T00:00:00Z",
      startAt: "2026-01-15T14:00:00Z",
      endAt: "2026-01-15T17:00:00Z",
      location: "Online",
      capacity: 50,
      registrations: 20,
      category: "TECH",
      published: false,
      image:
        "https://images.stockcake.com/public/f/8/c/f8cd7c02-92ee-4ad9-8109-ed7b920d4f4e_large/code-in-focus-stockcake.jpg",
      user_id: "11111111-2222-3333-4444-555555555555",
    },
    {
      title: "Digital Art Expo",
      description:
        "Digital Art Expo is a vibrant showcase of contemporary digital creativity, bringing together artists, designers, and technologists from around the world. Explore cutting-edge digital artworks, immersive installations, and innovative visual experiences that blur the line between art and technology. Discover new tools, techniques, and trends shaping the future of digital art, connect with creators and enthusiasts, and get inspired by the next generation of visual storytelling.",
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
      user_id: "11111111-2222-3333-4444-555555555555",
    },
  ];

  const { data, error } = await supabaseAdmin
    .from("events")
    .insert(sampleEvents)
    .select("*"); // select everything including created_at

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Seeded events", data });
}
