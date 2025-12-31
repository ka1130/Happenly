"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  PencilSquareIcon,
  ClockIcon,
  MapPinIcon,
  TrashIcon,
  XCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Event } from "@apptypes/event";
import ConfirmDialog from "@components/ConfirmDialog";
import { formatCategory } from "@utils/formatCategory";
import { formatTimeRange } from "@utils/formatTimeRange";

export const status = (event: Event) => {
  if (!event) return "DRAFT";
  if (event.registrations >= event.capacity) return "FULL";
  if (event.published) return "PUBLISHED";
  return "DRAFT";
};

export const STATUS_CONFIG = {
  FULL: {
    label: "Full",
    className: "text-red-600",
  },
  PUBLISHED: {
    label: "Published",
    className: "text-green-700",
  },
  DRAFT: {
    label: "Draft",
    className: "text-orange-300",
  },
} as const;

type EventCardProps = {
  event: Event;
  onDeleteAction?: (id: string) => void;
  currentUserId?: string | null;
};

function EventCard({ event, onDeleteAction, currentUserId }: EventCardProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!deleteError) return;

    const timer = setTimeout(() => {
      setDeleteError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [deleteError]);

  const handleDelete = async () => {
    setConfirmDeleteOpen(false);
    setLoadingDelete(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "There was a problem deleting the event");
        return;
      }

      console.log("Removed event:", event.title);
      if (onDeleteAction) onDeleteAction(event.id);
    } catch (err: any) {
      setDeleteError(
        err.message || "There was a problem with removing this event",
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="flex h-[500px] w-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:bg-stone-50 hover:shadow-xl">
      <div className="relative">
        <img
          src={event.image || "/images/placeholder-card.svg"}
          alt={event.title}
          className="h-[208px] w-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`mr-3 rounded-md bg-stone-100/20 px-3 py-1 text-sm font-medium ${
              STATUS_CONFIG[status(event)].className
            }`}
          >
            {STATUS_CONFIG[status(event)].label}
          </span>
          <span className="rounded-md bg-stone-200 px-3 py-1 text-sm font-medium">
            {formatCategory(event.category)}
          </span>
        </div>
      </div>
      <div className="flex flex-col p-5">
        <div className="mb-10 flex flex-1 flex-col space-y-2">
          <div>
            <h3 className="font-sans text-xl font-bold text-stone-900">
              {event.title}
            </h3>
            <p className="mt-1 mb-4 truncate text-stone-500">
              {event.description}
            </p>
          </div>

          <p className="flex gap-2 text-sm text-stone-500">
            <CalendarIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{event.date}</span>
          </p>

          <p className="flex gap-2 text-sm text-stone-500">
            <ClockIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{formatTimeRange(event.startAt, event.endAt)}</span>
          </p>

          <p className="flex gap-2 text-sm text-stone-500">
            <MapPinIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>{event.location}</span>
          </p>

          <p className="flex gap-2 text-sm text-stone-500">
            <UsersIcon
              className="relative top-[px] h-4.5 w-4.5"
              strokeWidth={2}
            />
            <span>
              {event.registrations} / {event.capacity} attendees
            </span>
          </p>
        </div>

        {deleteError && (
          <div
            onClick={() => setDeleteError("")}
            className="mb-2 flex cursor-pointer items-center justify-between gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            <span className="min-w-0 truncate">{deleteError}</span>

            <XCircleIcon className="h-5 w-5 shrink-0 text-red-400" />
          </div>
        )}

        {event.user_id === currentUserId && (
          <div className="mt-auto flex justify-between gap-4">
            <Link
              href={`/edit/${event.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-1 cursor-pointer justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 focus:ring-2 focus:ring-stone-400 focus:outline-none"
            >
              <PencilSquareIcon className="relative top-[px] h-4 w-4" />
              <span>Edit</span>
            </Link>
            <button
              disabled={loadingDelete}
              className="cursor-pointer rounded-md p-2 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDeleteOpen(true);
              }}
            >
              <TrashIcon className="h-4 w-4 text-red-700" />
            </button>
            <ConfirmDialog
              open={confirmDeleteOpen}
              title="Delete Event"
              message="Are you sure you want to delete this event? This action cannot be undone and all registration data will be lost."
              onCancelAction={() => setConfirmDeleteOpen(false)}
              onConfirmAction={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="w-full animate-pulse overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="h-52 w-full bg-stone-200" />
      <div className="flex flex-col p-5">
        <div className="mb-10 flex flex-1 flex-col space-y-2">
          <div>
            <div className="h-6 w-3/4 rounded bg-stone-300" />
            <div className="mt-2 h-4 w-full rounded bg-stone-200" />{" "}
            <div className="mt-1 h-4 w-5/6 rounded bg-stone-200" />{" "}
          </div>
          <div className="mt-4 space-y-1">
            <div className="h-4 w-1/2 rounded bg-stone-200" />
            <div className="h-4 w-1/3 rounded bg-stone-200" />
            <div className="h-4 w-2/3 rounded bg-stone-200" />
            <div className="h-4 w-1/2 rounded bg-stone-200" />
          </div>
        </div>
        <div className="mt-auto flex justify-between gap-4">
          <div className="h-8 w-1/2 rounded bg-stone-200" />
          <div className="h-8 w-1/4 rounded bg-stone-200" />
        </div>
      </div>
    </div>
  );
}
export default React.memo(EventCard);
