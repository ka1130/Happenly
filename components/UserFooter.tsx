"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";

export default function UserFooter() {
  const [user, setUser] = useState<any>(null);

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

  if (!user) {
    return (
      <div className="mt-auto flex items-center justify-center border-t border-gray-200 p-4 md:pr-0">
        <Link href="/auth" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </div>
    );
  }

  const { full_name, avatar_url } = user.user_metadata || {};

  return (
    <div className="mt-auto flex items-center justify-between border-t border-gray-200 px-0 py-4 md:py-6 md:pr-0 md:pl-4">
      {/* Left: avatar + text */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          {avatar_url ? (
            <img
              src={avatar_url}
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-300" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{full_name || "No name"}</span>
          <span className="max-w-[140px] truncate text-sm text-gray-500">
            {user.email}
          </span>
        </div>
      </div>

      {/* Right: settings link */}
      <Link
        href="/settings"
        className="flex items-center rounded-full p-2 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
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
    </div>
  );
}
