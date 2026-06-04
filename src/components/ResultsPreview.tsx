export function ResultsPreview() {
  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="rounded-xl border border-border/40 bg-gradient-to-b from-card/80 to-background p-1 shadow-2xl shadow-primary/5">
        <div className="rounded-lg border border-border/20 bg-background/95 p-6 backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground/60">
                Results
              </h3>
              <p className="text-xs text-foreground/40">
                Analysis for Software Engineer
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Complete
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-2 flex size-24 items-center justify-center sm:size-28">
                  <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
                    <circle cx="56" cy="56" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" opacity={0.15} />
                    <circle cx="56" cy="56" r="46" fill="none" strokeWidth="8" strokeLinecap="round" strokeDasharray="289" strokeDashoffset="72" className="text-amber-400" opacity={0.8} />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold tracking-tight sm:text-3xl">75</span>
                    <span className="text-[10px] text-muted-foreground">/100</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">ATS Score</span>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-3">
              <div>
                <p className="mb-1.5 text-xs font-medium text-emerald-400">Matched Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "TypeScript", "Agile", "REST APIs", "CI/CD", "Leadership"].map((kw) => (
                    <span key={kw} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-red-400">Missing Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Kubernetes", "Terraform", "GraphQL", "Docker"].map((kw) => (
                    <span key={kw} className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[11px] text-red-400">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-l-4 border-l-primary/60 border-border/30 bg-card/50 p-3">
            <p className="text-xs leading-relaxed text-foreground/70">
              <span className="font-medium text-foreground">Verdict:</span>{" "}
              Your resume shows strong technical alignment but lacks cloud-native keywords
              (Kubernetes, Terraform). Adding these and quantifying your impact could push
              your score past 85. Fix the missing keywords and 3 weak bullets to compete
              effectively for senior roles.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border/20 bg-card/30 p-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground">Original</p>
              <p className="truncate text-xs text-foreground/60">
                Responsible for managing the team and helping with projects
              </p>
            </div>
            <div className="hidden w-px self-stretch bg-border/40 sm:block" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-primary">Rewritten</p>
              <p className="truncate text-xs text-foreground">
                Led a cross-functional team of 5 engineers to deliver 12+ projects on time,
                improving sprint velocity by 30% over two quarters
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-2 -left-2 -right-2 -z-10 h-full rounded-xl border border-primary/10 bg-gradient-to-t from-primary/5 to-transparent blur-sm" />
    </div>
  );
}
