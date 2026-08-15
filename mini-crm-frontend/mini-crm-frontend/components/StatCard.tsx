import { LucideIcon } from "lucide-react";
import clsx from "clsx";

export default function StatCard({
  label,
  value,
  icon: Icon,
  tint = "primary",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tint?: "primary" | "green" | "red" | "orange" | "purple";
}) {
  const tints: Record<string, string> = {
    primary: "bg-primary-50 text-primary-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="card flex items-center gap-4 p-4">
      <div className={clsx("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tints[tint])}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-ink-500">{label}</p>
        <p className="text-xl font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}
