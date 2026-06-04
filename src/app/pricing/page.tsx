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
import { PRO_PRICE } from "@/lib/constants";
import { Check, Loader2, ChevronDown, Sparkles } from "lucide-react";

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes. Upgrade from Free to Pro instantly via Stripe. Downgrade at any time — your Pro features remain active until the end of the billing period.",
  },
  {
    q: "What happens when I hit the free scan limit?",
    a: "You'll see a notice and can either wait for your scans to reset next month or upgrade to Pro for unlimited scans. Your past results are never deleted.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "The Free tier is effectively a trial — you get 3 full scans with all features. Try it before committing.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, cancel anytime from your Account page. You'll keep Pro access until the end of your paid period. No refunds for partial months.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit cards and debit cards. Payments are processed securely through Stripe.",
  },
];

const comparisonRows = [
  { feature: "ATS match scoring", free: true, pro: true },
  { feature: "Keyword gap analysis", free: true, pro: true },
  { feature: "Bullet point rewrites", free: true, pro: true },
  { feature: "Scans per month", free: "3", pro: "Unlimited" },
  { feature: "Cover letter generation", free: false, pro: true },
  { feature: "Priority support", free: false, pro: true },
];

export default function PricingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const monthlyPrice = PRO_PRICE;
  const annualPrice = Math.round(PRO_PRICE * 10);

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 animate-fade-in-up duration-500">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-2 text-muted-foreground">
          Start free. Upgrade when you&apos;re serious.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border/50 bg-card/50 p-1">
          <button
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setAnnual(true)}
          >
            Annual
            <span className="ml-1.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Card className="glass-card transition-all duration-300 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5">
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
              {[
                "3 scans per month",
                "ATS match scoring",
                "Keyword gap analysis",
                "Bullet point rewrites",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 shrink-0 text-primary" />
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

        <Card className="border-primary/30 bg-primary/[0.03] glass-card transition-all duration-300 hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pro</CardTitle>
              <Badge>Popular</Badge>
            </div>
            <CardDescription>
              For active job seekers
            </CardDescription>
            <div className="mt-2">
              <span className="text-4xl font-bold">
                ${annual ? annualPrice : monthlyPrice}
              </span>
              <span className="ml-1 text-muted-foreground">
                /{annual ? "year" : "month"}
              </span>
              {annual && (
                <p className="mt-0.5 text-xs text-emerald-400">
                  ${monthlyPrice}/mo billed annually
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Unlimited scans",
                "ATS match scoring",
                "Keyword gap analysis",
                "Bullet point rewrites",
                "Cover letter generation",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 shrink-0 text-primary" />
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
                className="w-full gap-2"
                onClick={handleUpgrade}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Redirecting...
                  </span>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Upgrade to Pro
                  </>
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

      {/* Feature comparison */}
      <div className="mt-16">
        <h2 className="mb-6 text-center text-xl font-bold tracking-tight">
          Compare plans
        </h2>
        <div className="overflow-hidden rounded-lg border border-border/50 glass-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-muted/20">
                <th className="px-4 py-3 text-left font-medium">Feature</th>
                <th className="px-4 py-3 text-center font-medium">Free</th>
                <th className="px-4 py-3 text-center font-medium">Pro</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.feature}
                  className="border-b border-border/10 transition-colors hover:bg-muted/10"
                >
                  <td className="px-4 py-3 text-foreground">{row.feature}</td>
                  <td className="px-4 py-3 text-center">
                    {row.free === true ? (
                      <Check className="mx-auto size-4 text-primary" />
                    ) : (
                      <span className="text-muted-foreground">{row.free}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.pro === true ? (
                      <Check className="mx-auto size-4 text-primary" />
                    ) : (
                      <span className="text-muted-foreground">{row.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="mb-6 text-center text-xl font-bold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="mx-auto max-w-2xl space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-border/30 glass-card transition-all duration-200"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/10"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="border-t border-border/20 px-4 py-3 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
