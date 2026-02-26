import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { CodeBlock } from "@/components/shared/code-block";
import { Github, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 md:py-40">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 pointer-events-none" />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* 배지 */}
          <div className="mb-6 inline-block">
            <Badge className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80">
              Modern Web Starter Kit
            </Badge>
          </div>

          {/* 제목 */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-300 dark:to-zinc-500 bg-clip-text text-transparent">
                다음 프로젝트를 위한
              </span>
            </span>
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900 dark:from-zinc-400 dark:via-zinc-300 dark:to-white bg-clip-text text-transparent">
                완벽한 스택
              </span>
            </span>
          </h1>

          {/* 설명 */}
          <p className="mb-8 text-lg text-zinc-400 sm:text-xl">
            Next.js, TypeScript, Tailwind CSS, shadcn/ui로 현대적이고
            확장 가능한 웹 애플리케이션을 빠르게 시작하세요.
          </p>

          {/* CTA 버튼 */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" className="gap-2" asChild>
              <a href="#quickstart">
                시작하기
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </div>

          {/* 코드블록 */}
          <div className="mx-auto max-w-2xl">
            <CodeBlock
              code="npx create-next-app@latest my-app --template modern-starter"
              language="bash"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
