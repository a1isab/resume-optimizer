"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ScoreRing } from "@/components/ScoreRing";
import { KeywordBadges } from "@/components/KeywordBadges";
import { BulletRewrites } from "@/components/BulletRewrites";
import { SummaryCard } from "@/components/SummaryCard";
import { CopyButton } from "@/components/CopyButton";
import { AnalysisSkeleton } from "@/components/AnalysisSkeleton";
import type { Scan } from "@/lib/types";

export function ResultsContent() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId");
  const supabase = createClient();
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scanId) {
      setError("No scan ID provided");
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("scans")
        .select("*")
        .eq("id", scanId)
        .eq("user_id", user.id)
        .single();

      if (!data) {
        setError("Scan not found");
      } else {
        setScan(data);
      }
      setLoading(false);
    });
  }, [scanId, supabase]);

  if (loading) return <AnalysisSkeleton />;

  if (error || !scan) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <p className="text-muted-foreground">{error || "Scan not found"}</p>
      </div>
    );
  }

  const keywords = {
    matched: (scan.matched_keywords as string[]) ?? [],
    missing: (scan.missing_keywords as string[]) ?? [],
  };
  const bullets = (scan.weak_bullets as { original: string; rewritten: string }[]) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Results</h1>

      <SummaryCard summary={scan.summary ?? ""} />

      <div className="flex justify-center py-4">
        <ScoreRing score={scan.ats_score ?? 0} />
      </div>

      <KeywordBadges
        matched={keywords.matched}
        missing={keywords.missing}
      />

      <BulletRewrites bullets={bullets} />

      <CopyButton bullets={bullets} />
    </div>
  );
}
