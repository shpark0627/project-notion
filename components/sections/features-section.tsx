import React from "react";
import {
  Code2,
  Zap,
  Palette,
  Box,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { FeatureCard } from "@/components/shared/feature-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const features = [
  {
    icon: Code2,
    title: "Next.js 16",
    description: "App Router와 최신 렌더링 기능으로 빠른 성능을 경험하세요",
    tooltip: "Latest version with improved performance",
  },
  {
    icon: Zap,
    title: "TypeScript",
    description: "타입 안정성으로 버그를 사전에 방지하세요",
    tooltip: "Strict mode enabled for maximum type safety",
  },
  {
    icon: Palette,
    title: "Tailwind CSS v4",
    description: "강력한 유틸리티 기반 CSS로 빠른 개발을 즐기세요",
    tooltip: "No config file needed with v4",
  },
  {
    icon: Box,
    title: "shadcn/ui",
    description: "아름답고 커스터마이징 가능한 UI 컴포넌트",
    tooltip: "100% accessible and unstyled components",
  },
  {
    icon: Sparkles,
    title: "lucide-react",
    description: "450+ 정교한 아이콘으로 UI를 완성하세요",
    tooltip: "Tree-shakeable and perfectly optimized",
  },
  {
    icon: CheckCircle2,
    title: "ESLint",
    description: "코드 품질을 자동으로 관리하세요",
    tooltip: "Pre-configured with Next.js best practices",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32 md:py-40">
      <Container>
        <SectionHeader
          badge="특징"
          title="모든 것이 포함되어 있습니다"
          description="프로덕션 레벨의 웹 애플리케이션을 위한 완벽한 스택"
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <div>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>{feature.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </Container>
    </section>
  );
}
