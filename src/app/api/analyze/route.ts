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

  const { resumeText, jobDescription } = await request.json();

  if (
    typeof resumeText !== "string" ||
    typeof jobDescription !== "string"
  ) {
    return NextResponse.json(
      { error: "resumeText and jobDescription are required" },
      { status: 400 }
    );
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

  const { data: scan } = await admin
    .from("scans")
    .insert({
      user_id: user.id,
      resume_text: resumeText,
      job_description: jobDescription,
      ats_score: result.ats_score,
      matched_keywords: result.matched_keywords,
      missing_keywords: result.missing_keywords,
      weak_bullets: result.weak_bullets,
      summary: result.summary,
    })
    .select("id")
    .single();

  await admin
    .from("users")
    .update({
      scan_count: profile.scan_count + 1,
      updated_at: now.toISOString(),
    })
    .eq("id", user.id);

  return NextResponse.json({ scanId: scan?.id });
}
