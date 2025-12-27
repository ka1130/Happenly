"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const setSess = async () => {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken, // guaranteed string
      });
      if (error) {
        toast.error(
          "Failed to set session: " + (error?.message || String(error)),
        );
        return;
      }
      setSessionReady(true);
    };
    setSess();
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const token = params.get("access_token");
    const refresh = params.get("refresh_token");

    if (!token || !refresh) {
      toast.error("Invalid reset link");
      return;
    }

    setAccessToken(token);
    setRefreshToken(refresh);

    const setSess = async () => {
      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: refresh, // guaranteed string
      });
      if (error) {
        toast.error(
          "Failed to set session: " + (error?.message || String(error)),
        );
        return;
      }
      setSessionReady(true);
    };
    setSess();
  }, []);

  const handleResetPassword = async () => {
    if (!sessionReady) {
      toast.error("Session not ready. Please wait a moment.");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error?.message || String(error));
      return;
    }

    toast.success("Password successfully updated");
    router.replace("/auth?mode=signIn");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Reset Password
        </h1>

        <div className="flex flex-col space-y-4">
          <input
            type="password"
            placeholder="New Password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            minLength={8}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <button
            type="submit"
            onClick={handleResetPassword}
            disabled={!sessionReady || loading}
            className="w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
          <button
            type="button"
            onClick={() => router.replace("/auth?mode=signIn")}
            className="mt-2 w-full cursor-pointer rounded-md bg-gray-100 py-2 text-gray-700 hover:bg-gray-200"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
