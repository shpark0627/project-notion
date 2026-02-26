import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function FooterSection() {
  return (
    <footer id="footer" className="py-20 sm:py-24">
      <div className="px-4 md:px-8">
        <Separator className="mb-12 bg-border" />

        <div className="flex items-start justify-between gap-8 md:gap-12">
          {/* 브랜드 - 왼쪽 */}
          <div className="flex-1">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">
              Modern Web Starter Kit
            </h3>
            <p className="text-sm text-foreground/70">
              차세대 웹 개발을 위한 완벽한 출발점. 프로덕션 레벨의 기술 스택으로
              빠르고 안정적인 프로젝트를 시작하세요.
            </p>
          </div>

          {/* Contact - 오른쪽 */}
          <div className="flex-shrink-0 text-right">
            <h4 className="mb-4 font-semibold text-sm uppercase text-foreground">
              Contact
            </h4>
            <a
              href="mailto:shpark0627@gmail.com"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              shpark0627@gmail.com
            </a>
          </div>
        </div>

        {/* 저작권 & 기술 배지 */}
        <Separator className="my-8 bg-border" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-foreground/50">
            © 2024 Modern Web Starter Kit. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-muted text-foreground">
              Next.js 16
            </Badge>
            <Badge variant="secondary" className="bg-muted text-foreground">
              TypeScript
            </Badge>
            <Badge variant="secondary" className="bg-muted text-foreground">
              Tailwind CSS
            </Badge>
            <Badge variant="secondary" className="bg-muted text-foreground">
              shadcn/ui
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}
