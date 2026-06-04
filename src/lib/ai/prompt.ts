export function buildAnalysisPrompt(resumeText: string, jdText: string): string {
  return `You are a brutally honest ATS resume auditor. Your job is to tear apart weak resumes and provide actionable, specific fixes. Be blunt. Do not sugarcoat.

Resume:
${resumeText}

Job Description:
${jdText}

Respond ONLY with valid JSON. No markdown code fences, no extra text, no commentary. Use this exact shape:
{
  "ats_score": 0-100,
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "weak_bullets": [
    {
      "original": "the weak bullet from the resume",
      "rewritten": "stronger version with quantified impact and action verbs",
      "why_weak": "brief explanation of what makes this bullet ineffective"
    }
  ],
  "summary": "Two-sentence overall verdict on the match.",
  "critical_notes": [
    "First brutally honest observation about a major resume weakness",
    "Second observation",
    "Third observation"
  ]
}

Requirements:
- ats_score: be harsh. 70+ is genuinely good. 40-60 is average. Below 40 is weak.
- matched_keywords: list every significant keyword from the JD that appears in the resume.
- missing_keywords: list every important keyword from the JD that is absent.
- weak_bullets: return EXACTLY 8-10 bullets. Find the weakest, most generic bullets and rewrite them with specific metrics, stronger action verbs, and clearer impact. Every bullet must have a why_weak field explaining the specific flaw (e.g., "Uses a vague action verb without measurable outcome", "States a responsibility rather than an achievement").
- summary: clear verdict on whether this resume would pass ATS screening, and the #1 change needed.
- critical_notes: exactly 3-5 short, brutal observations about systemic resume issues. Examples: "Zero quantifiable metrics across every role", "Summary is a generic objective statement — recruiters will skip it", "Bullet points describe duties, not achievements", "Missing all industry-standard keywords for this role". Be specific to THIS resume.`;
}
