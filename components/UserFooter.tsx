"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRightEndOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import InitialsAvatar from "@components/InitialsAvatar";
import { supabase } from "@lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function UserFooter({
  onLinkClickAction,
}: {
  onLinkClickAction?: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    if (onLinkClickAction) onLinkClickAction();

    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      console.error("Logout failed:", error.message);
      toast.error("Failed to log out. Please try again.");
      return;
    }

    toast.success("Successfully logged out");
    setUser(null);
    router.replace("/");
  };

  if (!user) {
    return (
      <div className="mt-auto border-t border-gray-200 p-4">
        <Link
          href="/auth?mode=signIn"
          onClick={onLinkClickAction} // **added**
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 hover:text-blue-600"
        >
          <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
          Log in
        </Link>
        <Link
          href="/auth?mode=signUp"
          onClick={onLinkClickAction} // **added**
          className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const { full_name, avatar_url } = user.user_metadata || {};

  return (
    <div className="mt-auto border-t border-gray-200 px-4 py-4">
      {/* <Link
        href="/settings"
        onClick={onLinkClickAction}
        className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-100"
      > */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-300">
          {avatar_url ? (
            <img
              src={avatar_url}
              alt="User Avatar"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <InitialsAvatar
              name={full_name || user.email}
              className="h-10 w-10"
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{full_name || "No name"}</span>
          <span className="max-w-[140px] truncate text-sm text-gray-500">
            {user.email}
          </span>
        </div>
      </div>

      {/* <ChevronRightIcon className="h-5 w-5" />
      </Link> */}

      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        aria-label="Log out"
        className={`mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 ${
          loading ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
        Log out
      </button>
    </div>
  );
}
