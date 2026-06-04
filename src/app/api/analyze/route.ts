import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { analyzeResume } from "@/lib/ai/gemini";
import { FREE_SCAN_LIMIT } from "@/lib/constants";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  let { data: profile } = await admin
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const { error: insertError } = await admin.from("users").insert({
      id: user.id,
      email: user.email ?? "",
      name: user.user_metadata?.name ?? null,
      plan: "free",
      scan_count: 0,
    });

    if (insertError) {
      return NextResponse.json(
        { error: `Failed to create profile: ${insertError.message}` },
        { status: 500 }
      );
    }

    const { data: newProfile } = await admin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!newProfile) {
      return NextResponse.json(
        { error: "Profile created but failed to read it back" },
        { status: 500 }
      );
    }

    profile = newProfile;
  }

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (
    profile.plan === "free" &&
    new Date(profile.updated_at) < firstOfMonth
  ) {
    await admin
      .from("users")
      .update({ scan_count: 0, updated_at: now.toISOString() })
      .eq("id", user.id);
    profile.scan_count = 0;
  }

  if (profile.plan === "free" && profile.scan_count >= FREE_SCAN_LIMIT) {
    return NextResponse.json(
      { error: "Scan limit reached. Upgrade to Pro for unlimited scans." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { resumeText, jobTitle } = body;
  let { jobDescription } = body;

  if (typeof resumeText !== "string") {
    return NextResponse.json(
      { error: "resumeText is required" },
      { status: 400 }
    );
  }

  const title = typeof jobTitle === "string" && jobTitle.trim().length > 0
    ? jobTitle.trim()
    : null;

  if (!title && typeof jobDescription !== "string") {
    return NextResponse.json(
      { error: "A job title or job description is required" },
      { status: 400 }
    );
  }

  if (title && typeof jobDescription !== "string") {
    try {
      const zenRes = await fetch("https://opencode.ai/zen/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ZEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-v4-flash-free",
          messages: [
            {
              role: "user",
              content: `Generate a realistic, detailed job description for a "${title}" position. Include a brief company context, 5-7 key responsibilities, 4-6 required qualifications, and 2-3 nice-to-haves. Make it specific to the ${title} role. Write 300-500 words. Return ONLY the job description text.`,
            },
          ],
          temperature: 0.5,
        }),
      });

      if (!zenRes.ok) {
        return NextResponse.json(
          { error: "Failed to generate job description from AI" },
          { status: 502 }
        );
      }

      const zenData = await zenRes.json();
      const generatedJd = zenData?.choices?.[0]?.message?.content ?? "";

      if (!generatedJd) {
        return NextResponse.json(
          { error: "AI returned an empty job description" },
          { status: 502 }
        );
      }

      jobDescription = generatedJd;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to generate job description";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  let result;
  try {
    result = await analyzeResume(resumeText, jobDescription);
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI analysis failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }

  const { data: scan, error: scanInsertError } = await admin
    .from("scans")
    .insert({
      user_id: user.id,
      resume_text: resumeText,
      job_description: jobDescription,
      job_title: title,
      ats_score: result.ats_score,
      matched_keywords: result.matched_keywords,
      missing_keywords: result.missing_keywords,
      weak_bullets: result.weak_bullets,
      summary: result.summary,
      critical_notes: result.critical_notes,
    })
    .select("id")
    .single();

  if (scanInsertError || !scan) {
    return NextResponse.json(
      { error: `Failed to save scan: ${scanInsertError?.message ?? "unknown error"}` },
      { status: 500 }
    );
  }

  await admin
    .from("users")
    .update({
      scan_count: profile.scan_count + 1,
      updated_at: now.toISOString(),
    })
    .eq("id", user.id);

  return NextResponse.json({ scanId: scan.id });
}
