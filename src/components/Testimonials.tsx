const testimonials = [
  {
    name: "Sarah M.",
    role: "Product Manager",
    persona: "mid-career",
    quote:
      "I was getting zero callbacks for months. After one scan, I found 14 missing keywords and rewrote my weakest bullets. I had two interviews within two weeks.",
  },
  {
    name: "James R.",
    role: "Software Engineer",
    persona: "mid-career",
    quote:
      "The bullet rewrites alone were worth it. My resume went from a list of duties to actual achievements with numbers. The ATS score jumped from 42 to 81.",
  },
  {
    name: "Maria K.",
    role: "Career Changer",
    persona: "career-switcher",
    quote:
      "Switching from teaching to UX design felt impossible. The keyword analysis showed me exactly what language to use. Landed my first design role in 3 months.",
  },
  {
    name: "Alex T.",
    role: "Recent Grad",
    persona: "recent-grad",
    quote:
      "As a new grad I had zero experience to draw from. The AI found projects and coursework I hadn't thought to include and turned them into proper bullet points.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-28">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Real results from real users
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Job seekers like you are landing more interviews with optimized resumes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="group rounded-lg border border-border/50 p-6 glass-card transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {t.name.charAt(0)}
                {t.name.charAt(t.name.indexOf(" ") + 1)}
              </div>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              &ldquo;{t.quote}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
