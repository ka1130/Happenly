// plik: hooks/useEventRegistrations.ts
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@lib/supabase";
import { Event } from "@apptypes/event";

export function useEventRegistrations(event: Event | null) {
  const [registrations, setRegistrations] = useState<number>(0);
  const [spotsRemaining, setSpotsRemaining] = useState<number>(0);
  const [userRegistered, setUserRegistered] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Pobranie zalogowanego użytkownika
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    fetchUser();
  }, []);

  // Pobranie rejestracji dla eventu
  useEffect(() => {
    if (!event || !currentUserId) return;

    const fetchRegistrations = async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", event.id);

      if (error) {
        console.error("Error fetching registrations:", error);
        return;
      }

      setRegistrations(data.length);
      setSpotsRemaining(Math.max(event.capacity - data.length, 0));
      setUserRegistered(!!data.find((r: any) => r.user_id === currentUserId));
    };

    fetchRegistrations();
  }, [event, currentUserId]);

  const handleRegister = async () => {
    if (!event || !currentUserId) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert({ event_id: event.id, user_id: currentUserId });

      if (error) throw error;

      setRegistrations((prev) => prev + 1);
      setSpotsRemaining((prev) => Math.max(prev - 1, 0));
      setUserRegistered(true);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!event || !currentUserId) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", event.id)
        .eq("user_id", currentUserId);

      if (error) throw error;

      setRegistrations((prev) => Math.max(prev - 1, 0));
      setSpotsRemaining((prev) => prev + 1);
      setUserRegistered(false);
    } catch (err) {
      console.error("Unregistration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    registrations,
    spotsRemaining,
    userRegistered,
    loading,
    handleRegister,
    handleUnregister,
  };
}
