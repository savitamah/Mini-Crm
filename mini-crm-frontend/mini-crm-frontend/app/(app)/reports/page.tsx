"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { api, apiErrorMessage } from "@/lib/api";
import { DashboardStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import { PageSpinner } from "@/components/ui/Spinner";
import { Target, TrendingUp, Trophy, DollarSign } from "lucide-react";

const PIE_COLORS = ["#4f5ff7", "#38bdf8", "#a78bfa", "#fb923c", "#f87171", "#34d399"];
const BAR_COLORS = ["#4f5ff7", "#818cf8", "#a78bfa", "#fb923c", "#f87171", "#38bdf8", "#34d399"];

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<DashboardStats>("/dashboard/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => setError(apiErrorMessage(err, "Could not load analytics.")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;
  if (error) return <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>;
  if (!stats) return null;

  const sourceData = Object.entries(stats.leadsBySource).map(([name, value]) => ({ name, value }));
  const statusData = Object.entries(stats.leadsByStatus).map(([name, value]) => ({ name, value }));
  const conversionRate = stats.totalLeads
    ? ((stats.dealsWon / stats.totalLeads) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">Reports &amp; Analytics</h1>
        <p className="text-sm text-ink-500">Analyze performance and track growth.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Leads" value={stats.totalLeads} icon={Target} tint="primary" />
        <StatCard label="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} tint="purple" />
        <StatCard label="Won Leads" value={stats.dealsWon} icon={Trophy} tint="green" />
        <StatCard label="Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} tint="orange" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-900">Leads by Source</h2>
          {sourceData.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-400">No source data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-900">Leads by Status</h2>
          {statusData.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-400">No status data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
