"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { supabase } from "@lib/supabase";

export default function UserFooter({
  onLinkClickAction,
}: {
  onLinkClickAction?: () => void;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
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
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  if (!user) {
    return (
      <div className="mt-auto border-t border-gray-200 p-4">
        <Link
          href="/auth"
          onClick={onLinkClickAction}
          className="flex items-center justify-center gap-2 rounded-md bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 hover:text-blue-600"
        >
          <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
          Log in
        </Link>
      </div>
    );
  }

  const { full_name, avatar_url } = user.user_metadata || {};

  return (
    <div className="mt-auto border-t border-gray-200 px-4 py-4">
      {/* User panel → settings */}
      <Link
        href="/settings"
        onClick={onLinkClickAction}
        className="flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
      >
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-300">
            {avatar_url && (
              <img
                src={avatar_url}
                alt="User Avatar"
                className="h-full w-full object-cover"
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

        {/* Right arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>

      <button
        onClick={handleLogout}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
        Log out
      </button>
    </div>
  );
}
