"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase";
import {
  CalendarIcon,
  ArrowTrendingUpIcon,
  TicketIcon,
  UsersIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Button from "@components/Button";

type StatCardProps = {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, trend, icon }: StatCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-stone-50 p-6 dark:border-gray-700 dark:bg-gray-800">
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-green-600 dark:text-green-400">{trend}</p>
      </div>
      <div className="rounded-md bg-blue-100 p-3 dark:bg-blue-900">{icon}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    totalRegs: 0,
    avgCapacity: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();

    const fetchStats = async () => {
      const { data: allEvents } = await supabase
        .from("events")
        .select("id, capacity");

      const { data: publishedEvents } = await supabase
        .from("events")
        .select("id, capacity")
        .eq("published", true);

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
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your events and track registrations
          </p>
        </div>
        {user && (
          <Button
            onClick={() => router.push("/events/new")}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
          >
            <PlusIcon className="h-4 w-4" /> <span>Create Event</span>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          trend="All time"
          icon={<CalendarIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Published Events"
          value={stats.publishedEvents}
          trend="Accepting registrations"
          icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Total Registrations"
          value={stats.totalRegs}
          trend="Across all events"
          icon={<TicketIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Avg. Capacity"
          value={`${stats.avgCapacity}%`}
          trend="Capacity used"
          icon={<UsersIcon className="h-6 w-6" />}
        />
      </div>
    </div>
  );
}
