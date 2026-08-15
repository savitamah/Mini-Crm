import clsx from "clsx";

const COLOR_MAP: Record<string, string> = {
  gray: "bg-ink-100 text-ink-600",
  blue: "bg-blue-50 text-blue-600",
  indigo: "bg-indigo-50 text-indigo-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  pink: "bg-pink-50 text-pink-600",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
  yellow: "bg-amber-50 text-amber-600",
};

export default function Badge({
  children,
  color = "gray",
  className,
}: {
  children: React.ReactNode;
  color?: keyof typeof COLOR_MAP;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        COLOR_MAP[color] ?? COLOR_MAP.gray,
        className
      )}
    >
      {children}
    </span>
  );
}
