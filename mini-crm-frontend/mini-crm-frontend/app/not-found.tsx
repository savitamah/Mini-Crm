import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-50 text-center">
      <p className="text-5xl font-semibold text-primary-600">404</p>
      <p className="text-sm text-ink-500">This page doesn&apos;t exist.</p>
      <Link href="/dashboard" className="btn-primary mt-2">
        Back to Dashboard
      </Link>
    </div>
  );
}
