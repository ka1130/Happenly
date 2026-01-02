"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useCurrentProfile } from "@hooks/useCurrentProfile";
import InitialsAvatar from "@components/InitialsAvatar";
import { supabase } from "@lib/supabase";

export default function UserFooter({
  onLinkClickAction,
}: {
  onLinkClickAction?: () => void;
}) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { profile, refreshProfile } = useCurrentProfile(user?.id);

  if (!user) {
    return (
      <div className="mt-auto border-t border-gray-200 p-4">
        <Link
          href="/auth?mode=signIn"
          onClick={onLinkClickAction}
          className="flex gap-2 rounded-md bg-stone-100 px-4 py-2"
        >
          <ArrowRightEndOnRectangleIcon className="h-5 w-5" /> Log in
        </Link>
      </div>
    );
  }

  const avatarFullUrl = profile?.avatar_url
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_url}?t=${Date.now()}`
    : null;

  const handleLogout = async () => {
    if (onLinkClickAction) onLinkClickAction();
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Logout failed");
    else {
      toast.success("Logged out");
      router.replace("/");
    }
  };

  return (
    <div className="mt-auto border-t border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300">
          {avatarFullUrl ? (
            <img
              src={avatarFullUrl}
              className="h-full w-full object-cover"
              alt="avatar"
            />
          ) : (
            <InitialsAvatar
              name={profile?.name || user.email || ""}
              className="h-10 w-10"
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{profile?.name || "No name"}</span>
          <span className="truncate text-sm text-gray-500">{user.email}</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-3 flex w-full gap-2 rounded-md bg-gray-100 px-4 py-2"
      >
        <ArrowLeftEndOnRectangleIcon className="h-5 w-5" /> Log out
      </button>
    </div>
  );
}
