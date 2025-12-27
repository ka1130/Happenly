import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Event } from "@apptypes/event";

export function useEventRegistrations(event: Event | null) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userRegistered, setUserRegistered] = useState(false);
  const [localRegistrationsIncrement, setLocalRegistrationsIncrement] =
    useState(0);
  const [loading, setLoading] = useState(false);

  // --- fetch current user ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return console.error("Auth error:", error);
      setCurrentUserId(data?.user?.id ?? null);
    };
    fetchUser();
  }, []);

  // --- check if user is already registered ---
  useEffect(() => {
    if (!event || !currentUserId) return;

    const checkRegistration = async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", event.id)
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Check registration error:", error);
        return;
      }
      if (data) setUserRegistered(true);
    };

    checkRegistration();
  }, [event, currentUserId]);

  const handleRegister = async () => {
    if (!event || !currentUserId) {
      alert("You must be logged in");
      return;
    }
    if (
      loading ||
      userRegistered ||
      event.capacity - (event.registrations + localRegistrationsIncrement) <= 0
    )
      return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .insert({ event_id: event.id, user_id: currentUserId })
        .select()
        .maybeSingle();

      if (error) {
        if (error.code === "23505") {
          // unikalny constraint, czyli już zarejestrowany
          setUserRegistered(true);
        } else {
          throw error;
        }
      } else if (data) {
        setUserRegistered(true);
        setLocalRegistrationsIncrement((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const registrations = event
    ? event.registrations + localRegistrationsIncrement
    : 0;
  const spotsRemaining = event ? event.capacity - registrations : 0;

  return {
    currentUserId,
    userRegistered,
    registrations,
    spotsRemaining,
    loading,
    handleRegister,
  };
}
