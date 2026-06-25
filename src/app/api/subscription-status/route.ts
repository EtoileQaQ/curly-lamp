import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ hasStripeCustomer: false }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[/api/subscription-status]", error);
    return NextResponse.json({ hasStripeCustomer: false });
  }

  return NextResponse.json({
    hasStripeCustomer: Boolean(data?.stripe_customer_id),
  });
}
