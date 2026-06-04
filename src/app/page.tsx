import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_TAGLINE } from "@/lib/constants";
import { ResultsPreview } from "@/components/ResultsPreview";
import { Testimonials } from "@/components/Testimonials";
import { Target, Brain, Zap, ArrowRight, Users, Check } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ATS Score",
    description:
      "See exactly how your resume performs against AI screeners with a precise 0-100 match score.",
    stat: "Know your exact match",
  },
  {
    icon: Brain,
    title: "Keyword Analysis",
    description:
      "Find which keywords from the job description are present in your resume and which are missing.",
    stat: "Up to 24 keywords per scan",
  },
  {
    icon: Zap,
    title: "Bullet Rewrites",
    description:
      "Get 8-10 of your weakest bullet points rewritten with stronger action verbs and quantified impact.",
    stat: "Each with why it was weak",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center animate-fade-in-up duration-700 sm:py-28">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Users className="size-3" />
          Trusted by 500+ job seekers
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {APP_TAGLINE}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Paste a job description, upload your resume, and get an instant ATS
          match score with AI-powered rewrite suggestions. Free to start.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="text-base gap-2">
              Try Free <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="text-base">
              See Pricing
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-28 animate-fade-in-up duration-700" style={{ animationDelay: "200ms" }}>
        <ResultsPreview />
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-28 sm:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="group rounded-lg border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5 glass-card"
            style={{
              animation: `fade-in-up 0.5s ease-out ${i * 0.15}s both`,
            }}
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <f.icon className="size-5" />
            </div>
            <h3 className="mb-1 font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.description}</p>
            <p className="mt-2 text-xs font-medium text-primary/80">{f.stat}</p>
          </div>
        ))}
      </section>

      <Testimonials />

      <section className="mx-auto max-w-4xl px-4 pb-28 animate-fade-in-up duration-700" style={{ animationDelay: "400ms" }}>
        <div className="rounded-lg border border-border/50 p-8 sm:p-12 glass-card transition-all duration-300 hover:border-primary/20 hover:shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight">
            Simple pricing
          </h2>
          <p className="mt-2 text-muted-foreground">
            Start free. Upgrade when you&apos;re serious about landing the role.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 p-6 glass-card transition-all duration-300 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5">
              <h3 className="font-semibold">Free</h3>
              <p className="mt-1 text-3xl font-bold">$0</p>
              <p className="mt-1 text-sm text-muted-foreground">
                3 scans per month
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  ATS match scoring
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Keyword gap analysis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Bullet point rewrites
                </li>
              </ul>
              <Link href="/auth/signup">
                <Button className="mt-6 w-full">Get Started</Button>
              </Link>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-6 glass-card transition-all duration-300 hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5">
              <h3 className="font-semibold">Pro</h3>
              <p className="mt-1 text-3xl font-bold">$12</p>
              <p className="mt-1 text-sm text-muted-foreground">
                /month &middot; unlimited scans
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Unlimited scans
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  Cover letter generation
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="mt-6 w-full" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
