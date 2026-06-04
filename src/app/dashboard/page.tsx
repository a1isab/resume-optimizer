import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { FileText, ArrowRight, Sparkles } from "lucide-react";

interface ScanRow {
  id: string;
  job_title: string | null;
  ats_score: number | null;
  created_at: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  const color =
    score >= 80 ? "text-emerald-400 border-emerald-500/30" :
    score >= 60 ? "text-amber-400 border-amber-500/30" :
    "text-red-400 border-red-500/30";
  return (
    <Badge variant="outline" className={`font-mono ${color}`}>
      {score}/100
    </Badge>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: scans } = await supabase
    .from("scans")
    .select("id, job_title, ats_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const hasScans = scans && scans.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasScans
              ? `You have ${scans.length} scan${scans.length === 1 ? "" : "s"} on record`
              : "Start your first analysis to see how your resume stacks up"}
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button className="gap-2">
            <Sparkles className="size-4" />
            New Scan
          </Button>
        </Link>
      </div>

      {!hasScans ? (
        <Card className="w-full max-w-md mx-auto glass-card">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="size-7" />
            </div>
            <h2 className="text-xl font-semibold">No scans yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start your first analysis to see how your resume stacks up.
            </p>
            <Link href="/dashboard/new">
              <Button className="mt-6">New Scan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {scans.map((scan: ScanRow) => (
            <Link
              key={scan.id}
              href={`/results?scanId=${scan.id}`}
              className="group flex items-center justify-between rounded-lg border border-border/50 bg-card p-4 glass-card transition-all duration-200 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {scan.job_title || "Untitled Scan"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(scan.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <ScoreBadge score={scan.ats_score} />
                <ArrowRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
