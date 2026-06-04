import { buildAnalysisPrompt } from "./prompt";
import type { AnalysisResult } from "@/lib/types";

export async function analyzeResume(
  resumeText: string,
  jdText: string
): Promise<AnalysisResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  const contents = buildAnalysisPrompt(resumeText, jdText);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${body}`);
  }

  const data = await response.json();

  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!rawText) {
    throw new Error("Gemini returned an empty response");
  }

  return parseResult(rawText);
}

function parseResult(raw: string): AnalysisResult {
  let cleaned = raw.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }

  try {
    const parsed = JSON.parse(cleaned);

    if (
      typeof parsed.ats_score !== "number" ||
      !Array.isArray(parsed.matched_keywords) ||
      !Array.isArray(parsed.missing_keywords) ||
      !Array.isArray(parsed.weak_bullets) ||
      typeof parsed.summary !== "string"
    ) {
      throw new Error("Response missing required fields");
    }

    return {
      ats_score: Math.max(0, Math.min(100, Math.round(parsed.ats_score))),
      matched_keywords: parsed.matched_keywords,
      missing_keywords: parsed.missing_keywords,
      weak_bullets: parsed.weak_bullets.map(
        (b: { original?: string; rewritten?: string }) => ({
          original: b.original ?? "",
          rewritten: b.rewritten ?? "",
        })
      ),
      summary: parsed.summary,
    };
  } catch (e) {
    throw new Error(
      `Failed to parse AI response. Please try again.`
    );
  }
}
