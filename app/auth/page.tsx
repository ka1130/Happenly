"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AuthPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"signIn" | "signUp" | "forgotPassword">(
    "signIn",
  );
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

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
    setLoading(true);
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);
    if (error) toast.error(error?.message || String(error));
    else {
      toast.success("Check your email for confirmation link!");
      setMode("signIn");
      setFullName("");
      setPassword("");
      setPasswordConfirm("");
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) toast.error(error?.message || String(error));
    else router.replace("/dashboard");
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) toast.error(error?.message || String(error));
    else toast.success("Check your email for password reset link");
  };

  if (user)
    return (
      <p className="mt-10 text-center">
        Logged in as {user.user_metadata?.full_name || user.email}
      </p>
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {mode === "signUp"
            ? "Create Account"
            : mode === "forgotPassword"
              ? "Reset Password"
              : "Welcome"}
        </h1>

        {mode !== "forgotPassword" && (
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
              autoComplete="new-password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            {mode === "signUp" && (
              <input
                type="password"
                placeholder="Confirm Password"
                minLength={8}
                value={passwordConfirm}
                required
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            )}
          </form>
        )}

        {mode === "forgotPassword" && (
          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {mode === "signUp" && (
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white transition hover:bg-blue-600"
            >
              Sign Up
            </button>
          )}
          {mode === "signIn" && (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              className="w-full cursor-pointer rounded-md border border-blue-500 py-2 text-blue-500 transition hover:bg-blue-50"
            >
              Sign In
            </button>
          )}
          {mode === "forgotPassword" && (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full cursor-pointer rounded-md bg-yellow-400 py-2 text-white transition hover:bg-yellow-500"
            >
              Send Reset Link
            </button>
          )}
        </div>

        <div className="mt-4 flex justify-between text-sm text-blue-500">
          {mode !== "signUp" && (
            <button
              type="button"
              onClick={() => setMode("signUp")}
              className="cursor-pointer underline"
            >
              Sign Up
            </button>
          )}
          {mode !== "signIn" && mode !== "forgotPassword" && (
            <button
              type="button"
              onClick={() => setMode("signIn")}
              className="cursor-pointer underline"
            >
              Sign In
            </button>
          )}
          {mode !== "forgotPassword" && (
            <button
              type="button"
              onClick={() => setMode("forgotPassword")}
              className="cursor-pointer underline"
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
