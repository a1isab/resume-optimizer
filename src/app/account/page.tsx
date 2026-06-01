"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FREE_SCAN_LIMIT, PRO_PRICE } from "@/lib/constants";
import type { UserProfile } from "@/lib/types";

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const loadProfile = async (retries: number): Promise<void> => {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
          setLoading(false);
          return;
        }

        if (retries > 0) {
          await fetch("/api/user/ensure-profile", { method: "POST" });
          return loadProfile(retries - 1);
        }

        setLoading(false);
      };

      loadProfile(2);
    });
  }, [supabase, router]);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!profile) return null;

  const initials = (profile.name ?? profile.email).slice(0, 2).toUpperCase();
  const isPro = profile.plan === "pro";
  const used = profile.scan_count;
  const remaining = Math.max(0, FREE_SCAN_LIMIT - used);

  return (
    <div className="mx-auto w-full max-w-lg space-y-6 px-4 py-10">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="size-12">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {profile.name ?? "User"}
            </CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Current plan
            </span>
            <Badge
              variant={isPro ? "default" : "outline"}
              className={isPro ? "" : "text-muted-foreground"}
            >
              {isPro ? "Pro" : "Free"}
            </Badge>
          </div>

          {isPro ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleManageSubscription}
              disabled={portalLoading}
            >
              {portalLoading ? "Redirecting..." : "Manage Subscription"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {remaining} of {FREE_SCAN_LIMIT} scans remaining
                  </span>
                  <span className="text-muted-foreground">
                    {used}/{FREE_SCAN_LIMIT}
                  </span>
                </div>
                <Progress value={(used / FREE_SCAN_LIMIT) * 100} />
              </div>
              <Button
                className="w-full"
                onClick={() => router.push("/pricing")}
              >
                Upgrade to Pro &mdash; ${PRO_PRICE}/mo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
