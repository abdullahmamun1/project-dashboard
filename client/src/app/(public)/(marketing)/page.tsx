import { CallToAction } from "@/components/modules/marketing/home/CallToAction";
import { Features } from "@/components/modules/marketing/home/Features";
import { Hero } from "@/components/modules/marketing/home/Hero";
import { HowItWorks } from "@/components/modules/marketing/home/HowItWorks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <CallToAction />
    </>
  );
}
