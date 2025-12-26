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
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";
import UserFooter from "@components/UserFooter";

const links = [
  { href: "/dashboard", label: "Dashboard", Icon: PresentationChartLineIcon },
  { href: "/events/new", label: "Create Event", Icon: PlusIcon },
  { href: "/my-events", label: "My Events", Icon: BookmarkSquareIcon },
  { href: "/", label: "Browse Events", Icon: GlobeAsiaAustraliaIcon },
  { href: "/settings", label: "Settings", Icon: Cog6ToothIcon },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

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
          <Link href="/" onClick={close}>
            <h2 className="flex items-center space-x-2 text-xl font-semibold">
              <img src="/images/logo.svg" className="h-7 w-7" alt="Logo" />
              <span className="hover:text-stone-600">Happenly</span>
            </h2>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-9 right-4"
          >
            <ChevronDoubleLeftIcon className="h-6 w-6 text-stone-500" />
          </button>
        </div>
        <nav className="flex flex-col space-y-6">
          {links.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className="flex items-center space-x-2 text-stone-700 hover:text-blue-600"
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <UserFooter onLinkClickAction={close} />
      </aside>
    </>
  );
}
