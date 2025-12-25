import Link from "next/link";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  BookmarkSquareIcon,
  PlusIcon,
  Cog6ToothIcon,
  PresentationChartLineIcon,
  GlobeAsiaAustraliaIcon,
} from "@heroicons/react/24/outline";
import MobileMenu from "@components/MobileMenu";
import UserFooter from "@components/UserFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // optional CSS variable
});

export const metadata: Metadata = {
  title: "Happenly",
  description: "Your Events, Your Dashboard — All in One Place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col bg-stone-50 shadow-md md:flex">
          <Link href="/">
            <h2 className="mb-6 flex items-center space-x-2 p-6 text-xl font-semibold">
              <img src="/images/logo.svg" className="h-7 w-7" alt="Logo" />
              <span className="hover:text-stone-600">Happenly</span>
            </h2>
          </Link>
          <nav className="flex flex-col space-y-3 p-6">
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
        <div className="flex-1">
          {/* Mobile header + drawer */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
          {/* Main content */}
          <main className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
