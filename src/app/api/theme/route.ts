import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

const THEMES = ["light", "dark", "system"] as const;

type Theme = (typeof THEMES)[number];

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && THEMES.includes(value as Theme);
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ theme: "light" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("theme")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[/api/theme][GET]", error);
    return NextResponse.json({ theme: "light" });
  }

  return NextResponse.json({
    theme: isTheme(data?.theme) ? data.theme : "light",
  });
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const theme = body?.theme;

  if (!isTheme(theme)) {
    return NextResponse.json({ error: "Thème invalide" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, theme }, { onConflict: "user_id" });

  if (error) {
    console.error("[/api/theme][PATCH]", error);
    return NextResponse.json(
      { error: "Impossible de sauvegarder le thème" },
      { status: 500 }
    );
  }

  return NextResponse.json({ theme });
}
