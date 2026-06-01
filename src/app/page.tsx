import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Target, Brain, Zap } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ATS Score",
    description:
      "See exactly how your resume performs against AI screeners with a precise 0-100 match score.",
  },
  {
    icon: Brain,
    title: "Keyword Analysis",
    description:
      "Find which keywords from the job description are present in your resume and which are missing.",
  },
  {
    icon: Zap,
    title: "Bullet Rewrites",
    description:
      "Get 3-5 of your weakest bullet points rewritten with stronger action verbs and quantified impact.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="flex flex-col items-center justify-center px-4 py-28 text-center">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {APP_TAGLINE}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Paste a job description, upload your resume, and get an instant ATS
          match score with AI-powered rewrite suggestions. Free to start.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="text-base">
              Try Free
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="text-base">
              See Pricing
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-28 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-border/50 p-6"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <f.icon className="size-5" />
            </div>
            <h3 className="mb-1 font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-28">
        <div className="rounded-lg border border-border/50 p-8 sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight">
            Simple pricing
          </h2>
          <p className="mt-2 text-muted-foreground">
            Start free. Upgrade when you&apos;re serious about landing the role.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 p-6">
              <h3 className="font-semibold">Free</h3>
              <p className="mt-1 text-3xl font-bold">$0</p>
              <p className="mt-1 text-sm text-muted-foreground">
                3 scans per month
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>ATS match scoring</li>
                <li>Keyword gap analysis</li>
                <li>Bullet point rewrites</li>
              </ul>
              <Link href="/auth/signup">
                <Button className="mt-6 w-full">Get Started</Button>
              </Link>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
              <h3 className="font-semibold">Pro</h3>
              <p className="mt-1 text-3xl font-bold">$12</p>
              <p className="mt-1 text-sm text-muted-foreground">
                /month &middot; unlimited scans
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Everything in Free</li>
                <li>Unlimited scans</li>
                <li>Cover letter generation</li>
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
