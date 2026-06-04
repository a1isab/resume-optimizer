import { buildAnalysisPrompt } from "./prompt";
import type { AnalysisResult } from "@/lib/types";

const ZEN_API_URL = "https://opencode.ai/zen/v1/chat/completions";
const MODEL = "deepseek-v4-flash-free";

export async function analyzeResume(
  resumeText: string,
  jdText: string
): Promise<AnalysisResult> {
  const apiKey = process.env.ZEN_API_KEY;
  if (!apiKey) {
    throw new Error("ZEN_API_KEY is not configured");
  }

  const promptText = buildAnalysisPrompt(resumeText, jdText);

  const response = await fetch(ZEN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: promptText }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Zen API error ${response.status}: ${body}`);
  }

  const data = await response.json();

  const rawText = data?.choices?.[0]?.message?.content ?? "";

  if (!rawText) {
    throw new Error("Zen returned an empty response");
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
  } catch {
    throw new Error(
      `Failed to parse AI response. Please try again.`
    );
  }
}
