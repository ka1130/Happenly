"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") || "signIn"; // signIn or signUp
  const [mode, setMode] = useState<"signIn" | "signUp">(modeParam as any);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Track auth state
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
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
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);

    if (error) {
      toast.error(error?.message || String(error));
      return;
    }

    toast.success("Check your email for confirmation link!");
    setMode("signIn");
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error(error?.message || String(error));
      return;
    }

    router.replace("/dashboard");
  };

  if (user)
    return (
      <p className="mt-8 text-center">
        Logged in as {user.user_metadata?.full_name || user.email}
      </p>
    );

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
              autoComplete="name"
              required
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <input
            type="password"
            placeholder="Password"
            minLength={8}
            value={password}
            autoComplete={
              mode === "signUp" ? "new-password" : "current-password"
            }
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          {mode === "signUp" && (
            <input
              type="password"
              placeholder="Confirm Password"
              minLength={8}
              autoComplete="new-password"
              value={passwordConfirm}
              required
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {mode === "signUp" ? (
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-60"
            >
              Sign Up
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-gray-100 py-2 text-gray-700 hover:bg-gray-200 disabled:opacity-60"
            >
              Sign In
            </button>
          )}
          <button
            type="button"
            onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
            disabled={loading}
            className="w-full cursor-pointer rounded-md bg-gray-50 py-2 text-blue-500 hover:bg-gray-100 disabled:opacity-60"
          >
            {mode === "signIn" ? "Switch to Sign Up" : "Switch to Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
