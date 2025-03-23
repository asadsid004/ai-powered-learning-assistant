import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Users, Lightbulb } from "lucide-react";

export function CTASection() {
  return (
    <section className="mb-20 mt-10">
      <div className="container px-4 md:px-6">
        <div className="">
          <div className="flex flex-col justify-center items-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Learning Journey?
              </h2>
              <p className="text-center text-muted-foreground md:text-xl mb-4">
                Join thousands of students, professionals, and lifelong learners
                who are mastering new skills with Quest AI.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Accelerated Learning</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn up to 3x faster with personalized AI guidance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">For Everyone</h3>
                    <p className="text-sm text-muted-foreground">
                      Perfect for students, professionals, and lifelong learners
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Lightbulb className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Improved Retention</h3>
                    <p className="text-sm text-muted-foreground">
                      Remember more with AI-generated quizzes and flashcards
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5 text-primary"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Structured Guidance</h3>
                    <p className="text-sm text-muted-foreground">
                      Follow clear learning paths tailored to your goals
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/api/auth/register">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
