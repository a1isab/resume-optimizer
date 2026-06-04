import { Upload, Brain, Target } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Paste a job title & upload your resume",
    description:
      "Pick any job title from our list or type your own. Upload your resume as text — no account needed to see what's possible.",
  },
  {
    icon: Brain,
    title: "AI scans against the real job market",
    description:
      "Our engine generates a realistic job description for your title, then cross-references every line of your resume against it — flagging gaps, weak bullets, and missing keywords.",
  },
  {
    icon: Target,
    title: "Get a fix list ranked by impact",
    description:
      "See your ATS match score, missing keywords, and 8-10 rewritten bullet points with plain-English explanations of why each original was weak.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-28">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          How it works
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Three minutes to a better resume. No fluff.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent sm:block" />

        <div className="space-y-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="group relative flex flex-col gap-4 sm:flex-row sm:gap-6"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${i * 0.2}s both`,
                }}
              >
                <div className="relative z-10 flex items-start gap-4 sm:w-64 sm:text-right sm:flex-row-reverse">
                  <div className="step-circle transition-colors group-hover:bg-primary/25">
                    <span>{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold sm:text-right">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <div className="relative z-10 flex-1 rounded-lg border border-border/30 bg-card/30 p-4 glass-card transition-all duration-300 group-hover:border-primary/20 sm:p-5">
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-4 shrink-0 text-primary/70" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
