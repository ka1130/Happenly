import { useState, useEffect } from "react";
import { supabase } from "@lib/supabase";
import { Event } from "@apptypes/event";

export function useEventRegistrations(event: Event | null) {
  const [registrations, setRegistrations] = useState(0);
  const [userRegistered, setUserRegistered] = useState<boolean | null>(null);
  const [spotsRemaining, setSpotsRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!event || !currentUserId) return;

    const fetchRegistrations = async () => {
      const { data } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", event.id);

      const total = data?.length ?? 0;
      setRegistrations(total);
      setSpotsRemaining(event.capacity - total);

      const isRegistered = data?.some((r: any) => r.user_id === currentUserId);
      setUserRegistered(isRegistered ?? false);
    };

    fetchRegistrations();
  }, [event, currentUserId]);

  const handleRegister = async () => {
    if (!currentUserId || !event) return;
    setLoading(true);
    await supabase.from("event_registrations").insert({
      event_id: event.id,
      user_id: currentUserId,
    });
    setUserRegistered(true);
    setRegistrations((prev) => prev + 1);
    setSpotsRemaining((prev) => prev - 1);
    setLoading(false);
  };

  const handleUnregister = async () => {
    if (!currentUserId || !event) return;
    setLoading(true);
    await supabase
      .from("event_registrations")
      .delete()
      .eq("event_id", event.id)
      .eq("user_id", currentUserId);
    setUserRegistered(false);
    setRegistrations((prev) => prev - 1);
    setSpotsRemaining((prev) => prev + 1);
    setLoading(false);
  };

  return {
    registrations,
    userRegistered,
    spotsRemaining,
    loading,
    handleRegister,
    handleUnregister,
  };
}
