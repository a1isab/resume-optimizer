export function buildAnalysisPrompt(resumeText: string, jdText: string) {
  return [
    {
      role: "user" as const,
      parts: [
        {
          text: `You are an expert ATS resume coach. Analyze the resume against the job description.

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
    { "original": "the weak bullet from the resume", "rewritten": "your improved version" }
  ],
  "summary": "Two-sentence overall verdict on the match."
}`,
        },
      ],
    },
  ];
}
