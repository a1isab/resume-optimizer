import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";
import { PRO_PRICE_ID } from "@/lib/constants";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("stripe_customer_id, email")
    .eq("id", user.id)
    .single();

  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email,
    mode: "subscription",
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/account?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/pricing?canceled=true`,
    metadata: { user_id: user.id },
    subscription_data: {
      metadata: { user_id: user.id },
    },
  });

  return NextResponse.json({ url: session.url });
}
