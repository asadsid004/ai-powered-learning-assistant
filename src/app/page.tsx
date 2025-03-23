import { buttonVariants } from "@/components/ui/button";
import { HeroSection } from "@/components/landing-page/hero-section";
import { FeatureGrid } from "@/components/landing-page/feature-grid";
import { CTASection } from "@/components/landing-page/cta-section";
import Image from "next/image";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  return (
    <div className="flex min-h-screen mx-auto flex-col items-center">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-5xl flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" width={50} height={40} />
            <span className="text-2xl font-bold">Quest AI</span>
          </div>
          <div className="flex items-center gap-4">
            <LoginLink className={buttonVariants({ variant: "secondary" })}>
              Login
            </LoginLink>
            <RegisterLink className={buttonVariants()}>Register</RegisterLink>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <HeroSection />
        <FeatureGrid />
        <CTASection />
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" width={40} height={40} />
            <span className="text-xl font-bold">Quest AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Transforming learning through AI-powered personalization.
          </p>
        </div>
      </footer>
    </div>
  );
}
