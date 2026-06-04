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
import { CriticalNotes } from "@/components/CriticalNotes";
import type { Scan } from "@/lib/types";

export function ResultsContent() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId");
  const supabase = createClient();
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!scanId) {
        setError("No scan ID provided");
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled || !user) { setLoading(false); return; }

      const { data } = await supabase
        .from("scans")
        .select("*")
        .eq("id", scanId)
        .eq("user_id", user.id)
        .single();

      if (cancelled) return;
      if (!data) {
        setError("Scan not found");
      } else {
        setScan(data);
      }
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
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
  const bullets = (scan.weak_bullets as { original: string; rewritten: string; why_weak: string }[]) ?? [];
  const criticalNotes = (scan.critical_notes as string[]) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10">
      <div className="animate-fade-in-up stagger-1">
        <h1 className="text-2xl font-bold tracking-tight">Results</h1>
      </div>

      {scan.job_title && (
        <div className="animate-fade-in-up stagger-2">
          <p className="text-sm text-muted-foreground -mt-4">
            Analysis for <span className="font-medium text-foreground">{scan.job_title}</span>
          </p>
        </div>
      )}

      <div className="animate-fade-in-up stagger-2">
        <CriticalNotes notes={criticalNotes} />
      </div>

      <div className="animate-fade-in-up stagger-3">
        <SummaryCard summary={scan.summary ?? ""} />
      </div>

      <div className="flex justify-center py-4 animate-scale-in stagger-4">
        <ScoreRing score={scan.ats_score ?? 0} />
      </div>

      <div className="animate-fade-in-up stagger-5">
        <KeywordBadges
          matched={keywords.matched}
          missing={keywords.missing}
        />
      </div>

      <div className="animate-fade-in-up stagger-6">
        <BulletRewrites bullets={bullets} />
      </div>

      <div className="animate-fade-in-up stagger-7">
        <CopyButton bullets={bullets} />
      </div>
    </div>
  );
}
