import { Loader2 } from "lucide-react";

export default function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`animate-spin text-primary-500 ${className}`} size={20} />;
}

export function PageSpinner() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
