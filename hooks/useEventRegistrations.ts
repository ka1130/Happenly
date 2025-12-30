import { supabase } from "@lib/supabase";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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
    if (!event) {
      toast.error("Event not loaded");
      return;
    }
    if (!currentUserId) {
      toast.error("You must be logged in");
      return;
    }

    setUserRegistered(true);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, userId: currentUserId }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || "Registration failed");
      }

      setLocalRegistrationsIncrement((prev) => prev + 1);
      toast.success("Registered successfully!");
    } catch (err: any) {
      console.error("Registration failed:", err);
      toast.error(err?.message || "Registration failed. Please try again.");

      setUserRegistered(false);
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
