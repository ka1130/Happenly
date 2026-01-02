"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@lib/supabase";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import InitialsAvatar from "@components/InitialsAvatar";

type ProfileForm = { name: string };

export default function SettingsPage() {
  const { user, loading } = useCurrentUser();
  const { profile, refreshProfile } = useCurrentProfile(user?.id);
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const { register, handleSubmit, reset } = useForm<ProfileForm>();

  useEffect(() => {
    if (!loading && !user) router.push("/auth?redirect=/settings");
  }, [loading, user, router]);

  useEffect(() => {
    if (!profile) return;
    reset({ name: profile.name || "" });
    if (profile.avatar_url)
      setAvatarPreview(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_url}?t=${Date.now()}`,
      );
  }, [profile, reset]);

  if (loading || !user) return <p>Loading...</p>;

  const saveProfile = async (data: ProfileForm) => {
    if (!user) return;
    try {
      let avatarPath = profile?.avatar_url || "";

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        avatarPath = `${user.id}/avatar.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(avatarPath, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;

        await supabase
          .from("profiles")
          .update({ avatar_url: avatarPath })
          .eq("id", user.id);
        await supabase.auth.updateUser({ data: { avatar_url: avatarPath } });
        await refreshProfile();

        setAvatarPreview(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarPath}?t=${Date.now()}`,
        );
      }

      await supabase
        .from("profiles")
        .update({ name: data.name, avatar_url: avatarPath })
        .eq("id", user.id);
      await supabase.auth.updateUser({
        data: { full_name: data.name, avatar_url: avatarPath },
      });
      await refreshProfile();

      setAvatarFile(null);
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const changePassword = async () => {
    const newPassword = prompt("New password");
    if (!newPassword) return;
    await supabase.auth.updateUser({ password: newPassword });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
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
              />
              <circle cx="12" cy="7" r="4" />
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
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <InitialsAvatar
                    name={user.user_metadata?.full_name || user.email}
                    className="h-full w-full object-cover"
                    fontSize="2rem"
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
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </button>
              <input
                type="file"
                id="avatarInput"
                className="hidden"
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 2 * 1024 * 1024)
                    return toast.error("File too large. Max 2MB");
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </div>

            <div className="flex-1 space-y-2">
              <form onSubmit={handleSubmit(saveProfile)}>
                <label className="block text-sm font-medium text-stone-700">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full rounded border border-stone-300 px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-2 inline-block cursor-pointer rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </form>
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
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
