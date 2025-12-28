"use client";

import { useState, useEffect } from "react";
import { supabase } from "@lib/supabase";
import {
  CalendarIcon,
  ArrowTrendingUpIcon,
  TicketIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, change, icon }: StatCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <p className="text-xs text-green-600 dark:text-green-400">
            +12% from last month
          </p>
        )}
      </div>
      <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900">{icon}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    totalRegs: 0,
    avgCapacity: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // All events
      const { data: allEvents } = await supabase
        .from("events")
        .select("id, capacity");
      // Published events
      const { data: publishedEvents } = await supabase
        .from("events")
        .select("id, capacity")
        .eq("status", "published");

      // Registrations
      const { data: regs } = await supabase
        .from("event_registrations")
        .select("event_id");

      const totalEvents = allEvents?.length ?? 0;
      const publishedCount = publishedEvents?.length ?? 0;
      const totalCapacity =
        publishedEvents?.reduce((sum, e) => sum + (e.capacity ?? 0), 0) ?? 0;
      const totalRegs = regs?.length ?? 0;
      const avgCapacity =
        totalCapacity > 0 ? Math.round((totalRegs / totalCapacity) * 100) : 0;

      setStats({
        totalEvents,
        publishedEvents: publishedCount,
        totalRegs,
        avgCapacity,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="mb-10 space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your events and track registrations
          </p>
        </div>
        <button className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2">
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          change="+12% from last month"
          icon={<CalendarIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Published Events"
          value={stats.publishedEvents}
          change="+5% from last month"
          icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Total Registrations"
          value={stats.totalRegs}
          change="+18% from last month"
          icon={<TicketIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Avg. Capacity"
          value={`${stats.avgCapacity}%`}
          icon={<UsersIcon className="h-6 w-6" />}
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">Recent Events</h2>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="flex-1 rounded-md border px-3 py-2"
          />
          <button className="rounded-md border px-4 py-2">Filters</button>
        </div>
      </div>
    </div>
  );
}
