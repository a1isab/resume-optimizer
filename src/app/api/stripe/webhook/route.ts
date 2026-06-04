import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { user_id?: string }; subscription_data?: { metadata?: { user_id?: string } }; customer?: string; subscription?: string };
    const userId = session.metadata?.user_id || session.subscription_data?.metadata?.user_id;

    if (userId) {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription
      );

      await admin
        .from("users")
        .update({
          plan: "pro",
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          subscription_status: subscription.status,
        })
        .eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as { metadata?: { user_id?: string }; status?: string };
    const userId = subscription.metadata?.user_id;

    if (userId) {
      await admin
        .from("users")
        .update({
          subscription_status: subscription.status,
        })
        .eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as { metadata?: { user_id?: string } };
    const userId = subscription.metadata?.user_id;

    if (userId) {
      await admin
        .from("users")
        .update({
          plan: "free",
          subscription_status: "canceled",
        })
        .eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
