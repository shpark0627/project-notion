"use client";

import React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { StepItem } from "@/components/shared/step-item";
import { CodeBlock } from "@/components/shared/code-block";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "저장소 클론",
    description: "GitHub에서 스타터 템플릿을 복제하거나 새 프로젝트 생성",
  },
  {
    step: 2,
    title: "의존성 설치",
    description: "선택한 패키지 매니저로 모든 필요한 라이브러리 설치",
  },
  {
    step: 3,
    title: "개발 시작",
    description: "개발 서버를 실행하고 즉시 커스터마이징 가능한 컴포넌트로 개발",
  },
];

const codeSamples = {
  npm: "npm install",
  pnpm: "pnpm install",
  yarn: "yarn install",
};

export function QuickStartSection() {
  return (
    <section id="quickstart" className="py-20 sm:py-32 md:py-40">
      <Container>
        <SectionHeader
          badge="시작하기"
          title="3단계로 시작하세요"
          description="몇 분만에 프로젝트를 준비할 수 있습니다"
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* 좌측: 스텝 */}
          <div className="space-y-6">
            {steps.map((item, idx) => (
              <StepItem
                key={idx}
                step={item.step}
                title={item.title}
                description={item.description}
                isLast={idx === steps.length - 1}
              />
            ))}
          </div>

          {/* 우측: 설치 명령 */}
          <div className="space-y-6">
            <Tabs defaultValue="npm" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-100 border border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800">
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
              </TabsList>

              {Object.entries(codeSamples).map(([key, code]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <CodeBlock code={code} language="bash" />
                </TabsContent>
              ))}
            </Tabs>

            {/* 주의사항 */}
            <Alert className="border-zinc-300 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-zinc-700 dark:text-zinc-300">
                Node.js 18.17 이상이 필요합니다
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </Container>
    </section>
  );
}
