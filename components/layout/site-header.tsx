"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navItems = [
  { label: "특징", href: "#features" },
  { label: "시작하기", href: "#quickstart" },
  { label: "기술 스택", href: "#stack" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="px-4 py-4 md:px-8">
        <div className="relative flex items-center justify-between">
          {/* 왼쪽 영역 - 로고 */}
          <div className="flex-shrink-0">
            <a
              href="#"
              className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent whitespace-nowrap"
            >
              Starter Kit
            </a>
          </div>

          {/* 중앙 영역 - 네비게이션 (절대 중앙 고정) */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 오른쪽 영역 - CTA */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <Button variant="outline" size="sm">
              로그인
            </Button>
            <Button size="sm" asChild>
              <a href="#quickstart">시작하기</a>
            </Button>
          </div>

          {/* 모바일 메뉴 */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="border-border bg-card">
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <SheetClose key={item.label} asChild>
                    <a
                      href={item.href}
                      className="text-lg font-medium text-card-foreground/70 hover:text-card-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
                <div className="flex flex-col gap-3 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full"
                  >
                    로그인
                  </Button>
                  <Button className="w-full" asChild>
                    <SheetClose asChild>
                      <a href="#quickstart">시작하기</a>
                    </SheetClose>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
