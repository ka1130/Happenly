import Link from 'next/link';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import {
  BookmarkSquareIcon,
  PlusIcon,
  Cog6ToothIcon,
  PresentationChartLineIcon,
  GlobeAsiaAustraliaIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // optional CSS variable
});

export const metadata: Metadata = {
  title: 'EventFlow',
  description: 'Your Events, Your Dashboard — All in One Place',
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
        <aside className="w-64 bg-gray-50 shadow-md p-6">
          <Link href="/">
            <h2 className="flex items-center space-x-2 text-xl font-semibold mb-6">
              <span className="bg-blue-600 rounded-md px-1.5 py-1.5 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-white" strokeWidth={2} />
              </span>
              <span className="hover:text-gray-600">EventFlow</span>
            </h2>
          </Link>
          <nav className="flex flex-col space-y-3">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <PresentationChartLineIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/events/new"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Event</span>
            </Link>
            <Link
              href="/events"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <BookmarkSquareIcon className="h-5 w-5" />
              <span>My Events</span>
            </Link>
            <Link
              href="/events"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <GlobeAsiaAustraliaIcon className="h-5 w-5" />
              <span>Browse Events</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="mx-auto pt-10 px-4">{children}</main>
      </body>
    </html>
  );
}
