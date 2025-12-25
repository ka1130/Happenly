"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bars3Icon,
  BookmarkSquareIcon,
  PlusIcon,
  Cog6ToothIcon,
  PresentationChartLineIcon,
  GlobeAsiaAustraliaIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import UserFooter from "@components/UserFooter";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-0 z-50 flex items-center border-b border-stone-200 bg-white px-4 py-2">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md p-2 focus:ring focus:outline-none"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </header>

      {/* Drawer overlay */}
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer menu */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-64 transform flex-col bg-white pl-4 shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative mb-10 flex items-center justify-between pt-8">
          <Link href="/">
            <h2 className="flex items-center space-x-2 text-xl font-semibold">
              <img src="/images/logo.svg" className="h-7 w-7" alt="Logo" />
              <span className="hover:text-stone-600">EventFlow</span>
            </h2>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-9 right-4"
          >
            <ArrowLeftEndOnRectangleIcon className="h-6 w-6 text-stone-500" />
          </button>
        </div>
        <nav className="flex flex-col space-y-6">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-stone-700 hover:text-blue-600"
          >
            <PresentationChartLineIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/events/new"
            className="flex items-center space-x-2 text-stone-700 hover:text-blue-600"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Event</span>
          </Link>
          <Link
            href="/my-events"
            className="flex items-center space-x-2 text-stone-700 hover:text-blue-600"
          >
            <BookmarkSquareIcon className="h-5 w-5" />
            <span>My Events</span>
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-2 text-stone-700 hover:text-blue-600"
          >
            <GlobeAsiaAustraliaIcon className="h-5 w-5" />
            <span>Browse Events</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center space-x-2 text-stone-700 hover:text-blue-600"
          >
            <Cog6ToothIcon className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
        <UserFooter />
      </aside>
    </>
  );
}
