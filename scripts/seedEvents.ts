import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seed() {
  try {
    const testEmail = `seeduser-${Date.now()}@example.com`;

    const { data: createUserData, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email: testEmail,
        password: "Password123!",
      });

    if (createUserError || !createUserData?.user)
      throw createUserError || new Error("Failed to create user");

    const testUserId = createUserData.user.id;

    const sampleEvents = [
      {
        title: "VR Art Exhibition",
        description: "Explore the cutting edge of creativity...",
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
        user_id: testUserId,
      },
      {
        title: "React + Next.js Workshop",
        description: "Join industry leaders for a full day of insights...",
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
        user_id: testUserId,
      },
      {
        title: "Digital Art Expo",
        description: "Digital Art Expo is a vibrant showcase...",
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
        user_id: testUserId,
      },
    ];

    const { data, error } = await supabaseAdmin
      .from("events")
      .insert(sampleEvents)
      .select("*");

    if (error) throw error;

    console.log("Seeded events successfully:", data);
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seed();
