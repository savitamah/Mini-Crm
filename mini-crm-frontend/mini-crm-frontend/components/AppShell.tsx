"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Users,
  Kanban,
  BellRing,
  ListChecks,
  BarChart3,
  Settings,
  LogOut,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { PageSpinner } from "./ui/Spinner";
import { initials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/leads", label: "Lead Pipeline", icon: Kanban },
  { href: "/follow-ups", label: "Follow-ups", icon: BellRing },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { session, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
    }
  }, [isLoading, session, router]);

  if (isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <PageSpinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-200 bg-white md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <LayoutGrid size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-ink-900">Mini CRM</p>
            <p className="text-[11px] leading-tight text-ink-400">Zoho-lite</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                )}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-ink-100 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-500 hover:bg-ink-100 hover:text-red-600"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ink-200 bg-white px-4 md:px-6">
          <div className="md:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <LayoutGrid size={16} />
            </div>
            <p className="text-sm font-semibold text-ink-900">Mini CRM</p>
          </div>
          <div className="hidden md:block" />
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                {initials(session.name)}
              </div>
              <span className="hidden text-sm font-medium text-ink-700 sm:block">{session.name}</span>
              <ChevronDown size={15} className="text-ink-400" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-ink-100 bg-white py-1 shadow-card"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="border-b border-ink-100 px-3 py-2">
                  <p className="truncate text-sm font-medium text-ink-900">{session.name}</p>
                  <p className="truncate text-xs text-ink-400">{session.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:bg-ink-50"
                >
                  <LogOut size={15} /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-ink-200 bg-white px-3 py-1.5 md:hidden">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium",
                  active ? "bg-primary-50 text-primary-700" : "text-ink-500"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
