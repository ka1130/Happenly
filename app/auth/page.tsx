"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignUp = async () => {
    setError(null);
    if (password !== passwordConfirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) setError(error.message);
    else alert("Check your email for confirmation link!");
  };

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else router.replace("/dashboard"); // redirect after login
  };

  if (user)
    return <p>Logged in as {user.user_metadata?.full_name || user.email}</p>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {mode === "signIn" ? "Sign In" : "Sign Up"}
        </h1>

        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
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
        </form>

        {error && (
          <p className="mt-3 text-center text-sm text-red-500">{error}</p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSignUp}
            className={`w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white transition hover:bg-blue-600 ${
              mode === "signIn" ? "hidden" : ""
            }`}
            disabled={loading}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={handleSignIn}
            className={`w-full cursor-pointer rounded-md border border-blue-500 py-2 text-blue-500 transition hover:bg-blue-50 ${
              mode === "signUp" ? "hidden" : ""
            }`}
            disabled={loading}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
            className="mt-2 cursor-pointer text-center text-sm text-gray-500 underline"
          >
            {mode === "signIn"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
