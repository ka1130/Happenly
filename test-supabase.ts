import "dotenv/config"; // <-- to ładuje .env.local
import { supabase } from "./lib/supabase.ts";

async function test() {
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    console.error("Supabase error:", error);
  } else {
    console.log("Supabase works! Data:", data);
  }
}

test();
