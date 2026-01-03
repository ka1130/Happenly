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
        description:
          "Step into a fully immersive VR art experience where technology meets creativity. Explore interactive installations crafted by digital artists from around the globe. Learn about the latest VR techniques and tools used to create 3D environments. Network with other tech-savvy art enthusiasts and share your impressions in real time. This event pushes the boundaries of traditional galleries, offering a futuristic way to experience art.",
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
        description:
          "Join this hands-on workshop to master React and Next.js in a practical setting. Explore modern web development patterns, performance optimization, and state management techniques. Build real-world projects and gain insight into server-side rendering and API integrations. Collaborate with other developers and receive live feedback from experienced instructors. By the end, you'll have actionable skills to create scalable and maintainable web applications.",
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
        description:
          "Digital Art Expo is a vibrant showcase of innovation at the intersection of art and technology. Discover generative art, interactive installations, and AI-driven creations from leading digital artists. Attend talks and panels explaining the techniques and software behind each piece. Engage with creators and explore emerging trends in digital and NFT art. This expo highlights how technology is transforming visual storytelling in the 21st century.",
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
