"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  BookmarkSquareIcon,
  PlusIcon,
  Cog6ToothIcon,
  PresentationChartLineIcon,
  GlobeAsiaAustraliaIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import MobileMenu from "@components/MobileMenu";
import UserFooter from "@components/UserFooter";

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="fixed top-0 left-0 hidden h-dvh w-64 flex-col overflow-y-auto bg-stone-50 shadow-md md:flex">
          <Link href="/">
            <h2 className="mb-6 flex items-center space-x-2 p-6 text-xl font-semibold">
              <img src="/images/logo.svg" className="h-7 w-7" alt="Logo" />
              <span>Happenly</span>
            </h2>
          </Link>

          <nav className="flex flex-1 flex-col space-y-3 p-6">
            <Link href="/" className="flex items-center gap-2">
              <PresentationChartLineIcon className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/events/new" className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Create Event
            </Link>
            <Link href="/my-events" className="flex items-center gap-2">
              <BookmarkSquareIcon className="h-5 w-5" />
              My Events
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <GlobeAsiaAustraliaIcon className="h-5 w-5" />
              Browse Events
            </Link>
            <Link href="/settings" className="flex items-center gap-2">
              <Cog6ToothIcon className="h-5 w-5" />
              Settings
            </Link>
          </nav>

          <UserFooter />
        </aside>
      )}

      {/* Main */}
      <div
        className={`flex min-h-screen flex-col transition-all ${
          sidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 border-b border-stone-200 px-4 py-2">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden cursor-pointer rounded-md p-2 text-stone-400 hover:bg-stone-100 md:flex"
          >
            {sidebarOpen ? (
              <ArrowsPointingOutIcon className="h-5 w-5" />
            ) : (
              <ArrowsPointingInIcon className="h-5 w-5" />
            )}
          </button>

          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>

        <main className="flex-1 bg-white px-4 py-12 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </>
  );
}
