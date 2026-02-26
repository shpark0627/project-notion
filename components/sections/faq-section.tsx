import React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "shadcn/ui와 다른 UI 라이브러리의 차이점은?",
    answer:
      "shadcn/ui는 복사-붙여넣기 기반의 컴포넌트 라이브러리로, 모든 소스 코드가 프로젝트에 포함됩니다. 이를 통해 완전한 커스터마이징과 의존성 제어가 가능합니다.",
  },
  {
    question: "Tailwind CSS를 꼭 사용해야 하나요?",
    answer:
      "Tailwind CSS는 필수가 아니지만 권장됩니다. 강력한 유틸리티 기반 CSS로 빠른 개발을 가능하게 하며, 파일 크기도 매우 작습니다.",
  },
  {
    question: "TypeScript는 필수인가요?",
    answer:
      "TypeScript는 선택사항이지만, 큰 프로젝트에서는 개발 생산성과 코드 안정성을 크게 향상시킵니다. 프로젝트의 규모에 따라 결정할 수 있습니다.",
  },
  {
    question: "프로덕션 배포는 어떻게 하나요?",
    answer:
      "Next.js는 Vercel, Netlify, AWS, Docker 등 다양한 플랫폼에 배포할 수 있습니다. Vercel은 Next.js 최적화로 권장됩니다.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 sm:py-32 md:py-40">
      <Container>
        <SectionHeader
          badge="FAQ"
          title="자주 묻는 질문"
          description="일반적인 질문과 답변을 확인하세요"
        />

        <div className="mt-16 max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="border border-border rounded-lg">
            {faqItems.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="border-border"
              >
                <AccordionTrigger className="hover:text-foreground px-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 px-4 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
