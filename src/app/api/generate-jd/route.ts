import { NextResponse } from "next/server";

const ZEN_API_URL = "https://opencode.ai/zen/v1/chat/completions";
const MODEL = "deepseek-v4-flash-free";

export async function POST(request: Request) {
  const apiKey = process.env.ZEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ZEN_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const { title } = await request.json();

  if (typeof title !== "string" || title.length < 2) {
    return NextResponse.json(
      { error: "A valid job title is required" },
      { status: 400 }
    );
  }

  const prompt = `Generate a realistic, detailed job description for a "${title}" position. Include:
- A brief company and team context (2-3 sentences)
- 5-7 key responsibilities as bullet points
- 4-6 required qualifications/skills
- 2-3 preferred/nice-to-have qualifications

Make it specific to the ${title} role, using realistic industry-standard requirements. Write 300-500 words total. Return ONLY the job description text, no commentary.`;

  try {
    const response = await fetch(ZEN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json(
        { error: `Zen API error ${response.status}: ${body}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const jobDescription = data?.choices?.[0]?.message?.content ?? "";

    if (!jobDescription) {
      return NextResponse.json(
        { error: "AI returned an empty description" },
        { status: 502 }
      );
    }

    return NextResponse.json({ jobDescription });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to generate job description";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
