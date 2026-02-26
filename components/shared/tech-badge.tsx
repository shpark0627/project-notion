import React from "react";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  version?: string;
  className?: string;
}

export function TechBadge({
  icon: Icon,
  name,
  version,
  className,
}: TechBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 transition-all",
        className
      )}
    >
      <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-400" />
      <span className="font-medium text-sm text-zinc-900 dark:text-white">{name}</span>
      {version && <span className="text-xs text-zinc-500 dark:text-zinc-500">{version}</span>}
    </div>
  );
}
