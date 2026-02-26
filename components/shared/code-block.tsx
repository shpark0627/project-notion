import React from "react";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: "bash" | "typescript" | "tsx" | "json";
  showCopyButton?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "bash",
  showCopyButton = true,
  className,
}: CodeBlockProps) {
  const languageMap: Record<string, string> = {
    bash: "bash",
    typescript: "ts",
    tsx: "tsx",
    json: "json",
  };

  return (
    <div className={cn("relative rounded-lg border border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-900", className)}>
      <div className="flex items-center justify-between border-b border-zinc-300 dark:border-zinc-800 px-4 py-3">
        <span className="text-xs font-mono text-zinc-600 dark:text-zinc-500">
          {languageMap[language]}
        </span>
        {showCopyButton && <CopyButton text={code} />}
      </div>
      <pre className="overflow-x-auto p-4">
        <code className={`font-mono text-sm text-zinc-900 dark:text-zinc-300 language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
