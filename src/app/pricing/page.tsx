"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, PRO_PRICE } from "@/lib/constants";
import { Check, Loader2 } from "lucide-react";

const freeFeatures = [
  "3 scans per month",
  "ATS match scoring",
  "Keyword gap analysis",
  "Bullet point rewrites",
];

const proFeatures = [
  "Unlimited scans",
  "ATS match scoring",
  "Keyword gap analysis",
  "Bullet point rewrites",
  "Cover letter generation",
  "Priority support",
];

export default function PricingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("users")
        .select("plan")
        .eq("id", user.id)
        .single();
      setPlan(data?.plan ?? null);
      setLoading(false);
    });
  }, [supabase]);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-2 text-muted-foreground">
          Start free. Upgrade when you&apos;re serious.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Card className="transition-all duration-300 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>For getting started</CardDescription>
            <div className="mt-2">
              <span className="text-4xl font-bold">$0</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {!loading && plan === "free" ? (
              <Badge className="w-full justify-center">Current Plan</Badge>
            ) : plan === "pro" ? null : (
              <Button
                className="w-full"
                onClick={() => router.push("/auth/signup")}
              >
                Get Started
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="border-primary/30 bg-primary/[0.03] transition-all duration-300 hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pro</CardTitle>
              <Badge>Popular</Badge>
            </div>
            <CardDescription>
              For active job seekers
            </CardDescription>
            <div className="mt-2">
              <span className="text-4xl font-bold">${PRO_PRICE}</span>
              <span className="ml-1 text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {!loading && plan === "pro" ? (
              <Badge className="w-full justify-center" variant="outline">
                Active
              </Badge>
            ) : !loading && plan === "free" ? (
              <Button
                className="w-full"
                onClick={handleUpgrade}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Redirecting...
                  </span>
                ) : (
                  "Upgrade to Pro"
                )}
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => router.push("/auth/signup")}
              >
                Get Started
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
