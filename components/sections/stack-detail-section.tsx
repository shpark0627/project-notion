import React from "react";
import {
  Box,
  Zap,
  FileJson,
  Code2,
  Palette,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { TechBadge } from "@/components/shared/tech-badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const frontendStack = [
  { name: "Next.js 16", version: "v16" },
  { name: "React 19", version: "v19" },
  { name: "TypeScript 5", version: "v5" },
];

const stylingStack = [
  { name: "Tailwind CSS", version: "v4" },
  { name: "shadcn/ui", version: "latest" },
  { name: "lucide-react", version: "v575" },
];

const toolsStack = [
  { name: "ESLint 9", version: "v9" },
  { name: "npm", version: "v10+" },
];

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "Next.js 16": Code2,
  "React 19": Sparkles,
  "TypeScript 5": FileJson,
  "Tailwind CSS": Palette,
  "shadcn/ui": Box,
  "lucide-react": Sparkles,
  "ESLint 9": FileJson,
  npm: Zap,
};

export function StackDetailSection() {
  return (
    <section id="stack" className="py-20 sm:py-32 md:py-40">
      <Container>
        <SectionHeader
          badge="기술 스택"
          title="완벽하게 선택된 스택"
          description="각 기술은 최신 모범 사례와 함께 선택되었습니다"
        />

        <div className="mt-16 space-y-12">
          {/* Frontend 스택 */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">Frontend</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {frontendStack.map((tech) => (
                <HoverCard key={tech.name}>
                  <HoverCardTrigger asChild>
                    <div className="cursor-pointer">
                      <TechBadge
                        icon={iconMap[tech.name] || Box}
                        name={tech.name}
                        version={tech.version}
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="border-border bg-card">
                    <p className="text-sm text-foreground">
                      {tech.name}에 대한 공식 문서를 확인하세요
                    </p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>

          {/* Styling 스택 */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">Styling & Components</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {stylingStack.map((tech) => (
                <HoverCard key={tech.name}>
                  <HoverCardTrigger asChild>
                    <div className="cursor-pointer">
                      <TechBadge
                        icon={iconMap[tech.name] || Box}
                        name={tech.name}
                        version={tech.version}
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="border-border bg-card">
                    <p className="text-sm text-foreground">
                      {tech.name}에 대한 공식 문서를 확인하세요
                    </p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>

          {/* Tools 스택 */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">Developer Tools</h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {toolsStack.map((tech) => (
                <HoverCard key={tech.name}>
                  <HoverCardTrigger asChild>
                    <div className="cursor-pointer">
                      <TechBadge
                        icon={iconMap[tech.name] || Box}
                        name={tech.name}
                        version={tech.version}
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="border-border bg-card">
                    <p className="text-sm text-foreground">
                      {tech.name}에 대한 공식 문서를 확인하세요
                    </p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
