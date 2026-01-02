"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@lib/supabase";

export default function AuthPage() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  // Track auth state
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
    if (error) toast.error(error?.message || String(error));
    else toast.success("Check your email for confirmation link!");
  };

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      router.push(redirectTo);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) toast.error(error?.message || String(error));
    else toast.success("Check your email for the reset link");
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
          onSubmit={(e) => {
            e.preventDefault();
            mode === "signIn" ? handleSignIn() : handleSignUp();
          }}
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
              mode === "signIn" ? "current-password" : "new-password"
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
              value={passwordConfirm}
              autoComplete="new-password"
              required
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : mode === "signIn"
                ? "Sign In"
                : "Sign Up"}
          </button>
        </form>

        {mode === "signIn" && (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="mt-2 cursor-pointer text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </button>
        )}

        <p className="mt-4 text-center text-sm text-gray-500">
          {mode === "signIn"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
            disabled={loading}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            {mode === "signIn" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
