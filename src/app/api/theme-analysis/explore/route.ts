import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const zoneName = typeof body?.zoneName === "string" ? body.zoneName.trim() : "";

  if (!zoneName) {
    return NextResponse.json({ error: "Zone invalide" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("theme_analysis")
    .update({
      status: "exploring",
      last_updated: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("zone_name", zoneName)
    .select("id");

  if (error) {
    console.error("[/api/theme-analysis/explore][PATCH]", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour la zone" },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    const { error: insertError } = await supabase.from("theme_analysis").insert({
      user_id: userId,
      zone_name: zoneName,
      status: "exploring",
      post_count: 0,
      last_updated: new Date().toISOString(),
    });

    if (insertError) {
      console.error("[/api/theme-analysis/explore][INSERT]", insertError);
      return NextResponse.json(
        { error: "Impossible de créer la zone" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
