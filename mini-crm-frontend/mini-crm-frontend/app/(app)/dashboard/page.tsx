"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Target,
  BellRing,
  ListChecks,
  Trophy,
  DollarSign,
  ArrowRight,
  Clock,
} from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { DashboardStats } from "@/lib/types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import { PageSpinner } from "@/components/ui/Spinner";
import { LEAD_STATUS_LABEL, LeadStatus, LEAD_STATUSES } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<DashboardStats>("/dashboard/stats")
      .then(({ data }) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => !cancelled && setError(apiErrorMessage(err, "Could not load dashboard stats.")))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <PageSpinner />;
  if (error)
    return <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>;
  if (!stats) return null;

  const stageEntries = LEAD_STATUSES.filter((s) => s !== "LOST").map((s) => ({
    key: s,
    label: LEAD_STATUS_LABEL[s],
    count: stats.leadsByStage[s] ?? 0,
  }));
  const maxStage = Math.max(1, ...stageEntries.map((s) => s.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500">A quick overview of your sales performance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Leads" value={stats.totalLeads} icon={Target} tint="primary" />
        <StatCard label="Total Contacts" value={stats.totalContacts} icon={Users} tint="purple" />
        <StatCard label="Follow-ups Today" value={stats.followUpsToday} icon={BellRing} tint="orange" />
        <StatCard label="Tasks Pending" value={stats.tasksPending} icon={ListChecks} tint="primary" />
        <StatCard label="Deals Won" value={stats.dealsWon} icon={Trophy} tint="green" />
        <StatCard label="Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} tint="green" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Lead Pipeline</h2>
            <Link href="/leads" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline">
              View pipeline <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {stageEntries.map((s) => (
              <div key={s.key} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-medium text-ink-500">{s.label}</span>
                <div className="h-2.5 flex-1 rounded-full bg-ink-100">
                  <div
                    className="h-2.5 rounded-full bg-primary-500"
                    style={{ width: `${(s.count / maxStage) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-xs font-semibold text-ink-700">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-900">Upcoming Follow-ups</h2>
            <Link href="/follow-ups" className="text-xs font-medium text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {stats.upcomingFollowUps.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-400">No upcoming follow-ups.</p>
          ) : (
            <ul className="space-y-3">
              {stats.upcomingFollowUps.map((f) => (
                <li key={f.id} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Clock size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-800">{f.title}</p>
                    <p className="truncate text-xs text-ink-400">
                      {f.leadName ? `${f.leadName} · ` : ""}
                      {formatDate(f.date)} {f.time ? formatTime(f.time) : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Deals Lost" value={stats.dealsLost} icon={Trophy} tint="red" />
        <StatCard label="Overdue Tasks" value={stats.overdueTasks} icon={ListChecks} tint="red" />
        <StatCard label="Pending Tasks" value={stats.tasksPending} icon={ListChecks} tint="orange" />
        <StatCard label="Follow-ups Today" value={stats.followUpsToday} icon={BellRing} tint="purple" />
      </div>
    </div>
  );
}
