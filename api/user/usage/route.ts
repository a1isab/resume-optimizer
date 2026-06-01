import { NextResponse } from "next/server";
import { createClient } from "../../src/lib/supabase/server";
import { FREE_SCAN_LIMIT } from "../../src/lib/constants";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("plan, scan_count")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    plan: profile.plan,
    used: profile.scan_count,
    total: profile.plan === "free" ? FREE_SCAN_LIMIT : Infinity,
    remaining:
      profile.plan === "free"
        ? Math.max(0, FREE_SCAN_LIMIT - profile.scan_count)
        : Infinity,
  });
}
