import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SidebarLayout from "@components/SidebarLayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body className="relative min-h-screen bg-gray-50">
        <SidebarLayout>{children}</SidebarLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
