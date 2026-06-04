"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Progress } from "@/components/ui/progress";
import { FREE_SCAN_LIMIT } from "@/lib/constants";
import { Crown } from "lucide-react";

export function UsageCounter() {
  const supabase = createClient();
  const [plan, setPlan] = useState("free");
  const [used, setUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("plan, scan_count")
        .eq("id", user.id)
        .single();
      if (data) {
        setPlan(data.plan);
        setUsed(data.scan_count);
      }
      setLoading(false);
    });
  }, [supabase]);

  if (loading) return null;
  if (plan === "pro") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 text-sm text-primary shadow-sm">
        <Crown className="size-4 shrink-0" />
        <span className="font-medium">Pro</span>
        <span className="text-primary/70">&mdash; unlimited scans</span>
      </div>
    );
  }

  const remaining = Math.max(0, FREE_SCAN_LIMIT - used);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {remaining} of {FREE_SCAN_LIMIT} free scans remaining
        </span>
        <span className="text-muted-foreground">
          {used}/{FREE_SCAN_LIMIT}
        </span>
      </div>
      <Progress value={(used / FREE_SCAN_LIMIT) * 100} />
    </div>
  );
}
