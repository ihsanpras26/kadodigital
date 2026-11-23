import { HeroSection } from "@/components/home/HeroSection";
import { CapabilitiesStrip } from "@/components/home/CapabilitiesStrip";
import { CatalogPreviewSection } from "@/components/home/CatalogPreviewSection";
import { FeaturesBentoSection } from "@/components/home/FeaturesBentoSection";
import { EcosystemSpotlightsSection } from "@/components/home/EcosystemSpotlightsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PricingSection } from "@/components/home/PricingSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ClosingCtaSection } from "@/components/home/ClosingCtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CapabilitiesStrip />
      <CatalogPreviewSection />
      <FeaturesBentoSection />
      <EcosystemSpotlightsSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <ClosingCtaSection />
    </>
  );
}
