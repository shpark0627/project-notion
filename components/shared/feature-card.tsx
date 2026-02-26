import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn("border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 transition-all min-h-56 flex flex-col", className)}>
      <CardContent className="pt-6 flex flex-col flex-1">
        <div className="mb-4">
          <Icon className="h-8 w-8 text-zinc-700 dark:text-zinc-400" />
        </div>
        <h3 className="mb-2 font-semibold text-lg text-zinc-900 dark:text-white">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 flex-1">{description}</p>
      </CardContent>
    </Card>
  );
}
