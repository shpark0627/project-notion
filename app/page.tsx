import React from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { QuickStartSection } from "@/components/sections/quick-start-section";
import { StackDetailSection } from "@/components/sections/stack-detail-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FooterSection } from "@/components/sections/footer-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <QuickStartSection />
        <StackDetailSection />
        <FaqSection />
        <FooterSection />
      </main>
    </>
  );
}
