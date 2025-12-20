import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Happenly',
  description: 'Admin dashboard',
};
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Menu</h2>
          <nav className="flex flex-col space-y-3">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              href="/events/new"
              className="text-gray-700 hover:text-blue-600"
            >
              Create Event
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-blue-600">
              My Events
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-blue-600">
              Browse Events
            </Link>
            <Link
              href="/settings"
              className="text-gray-700 hover:text-blue-600"
            >
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
