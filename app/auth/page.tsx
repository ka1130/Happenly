"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // **Fetch user on mount and subscribe to auth state changes**
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      if (password !== passwordConfirm) {
        toast.error("Passwords do not match");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) throw error;

      toast.success("Check your email for confirmation link!");
      setFullName("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setMode("signIn");
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Successfully signed in");
      router.replace("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <p>Logged in as {user.user_metadata?.full_name || user.email}</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {mode === "signIn" ? "Sign In" : "Sign Up"}
        </h1>

        <div className="flex flex-col space-y-4">
          {mode === "signUp" && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              autoComplete="name"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            autoComplete="new-password"
          />
          {mode === "signUp" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              autoComplete="new-password"
            />
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {mode === "signIn" ? (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-60"
            >
              Sign In
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-60"
            >
              Sign Up
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
            className="w-full cursor-pointer rounded-md border border-blue-500 py-2 text-blue-500 hover:bg-blue-50 disabled:opacity-60"
          >
            {mode === "signIn"
              ? "Create an account"
              : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );
}
