import { useState, useEffect, useCallback } from "react";
import { supabase } from "@lib/supabase";

export function useCurrentProfile(userId?: string) {
  const [profile, setProfile] = useState<{
    name: string;
    avatar_url: string;
  } | null>(null);

  const fetchProfile = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (data) setProfile(data);
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return { profile, refreshProfile: fetchProfile };
}
