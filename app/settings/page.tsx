"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase";
import { useCurrentUser } from "@hooks/useCurrentUser";

type Profile = {
  name: string;
  avatarUrl: string;
};

export default function SettingsPage() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({ name: "", avatarUrl: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth?redirect=/settings");
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user.id)
        .maybeSingle() // zamiast single() — zwraca null jeśli brak
        .then(({ data, error }) => {
          if (error) console.error(error);
          if (data)
            setProfile({
              name: data.name || "",
              avatarUrl: data.avatar_url || "",
            });
        });
    }
  }, [user]);

  if (loading || !user) return <p>Loading...</p>;

  const saveName = async () => {
    await supabase
      .from("profiles")
      .update({ name: profile.name })
      .eq("id", user.id);
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    const ext = avatarFile.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true });
    await supabase
      .from("profiles")
      .update({ avatar_url: path })
      .eq("id", user.id);
    setProfile((prev) => ({ ...prev, avatarUrl: path }));
  };

  const changePassword = async () => {
    const newPassword = prompt("New password");
    if (!newPassword) return;
    await supabase.auth.updateUser({ password: newPassword });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    location.href = "/";
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-6 px-4">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Settings</h1>
        <p className="mt-1 text-stone-500">Manage your account preferences</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-stone-200 bg-stone-50 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-stone-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
              ></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <div className="text-lg font-semibold text-stone-800">Profile</div>
          </div>
          <div className="text-sm text-stone-500">
            Update your personal information
          </div>
        </div>

        <div className="space-y-6 p-6 pt-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full border border-stone-200">
                {profile.avatarUrl && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatarUrl}`}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                )}
              </span>
              <button
                onClick={() => document.getElementById("avatarInput")?.click()}
                className="absolute right-0 bottom-0 rounded-full bg-blue-500 p-1.5 text-white hover:bg-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
              </button>
              <input
                type="file"
                id="avatarInput"
                className="hidden"
                onChange={(e) =>
                  e.target.files && setAvatarFile(e.target.files[0])
                }
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-stone-700">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={saveName}
                className="mt-2 inline-block rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="rounded-xl border border-stone-200 bg-stone-50 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-stone-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div className="text-lg font-semibold text-stone-800">Security</div>
          </div>
          <div className="text-sm text-stone-500">
            Manage your password and security settings
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6 pt-0">
          <button
            onClick={changePassword}
            className="self-start rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            Change Password
          </button>
          <button
            onClick={logout}
            className="self-start rounded bg-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
