"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Enregistre le post rédigé dans Supabase avec le statut "ready" (Prêt),
 * puis redirige vers le tableau de bord.
 */
export async function savePost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const title = (formData.get("title") as string)?.trim() || "Sans titre";
  const content = (formData.get("content") as string)?.trim();
  const writeMode = (formData.get("writeMode") as string | null)?.trim();

  if (writeMode !== "post_ready") {
    throw new Error("Réponds d'abord aux questions avant de valider le post.");
  }

  if (!content) {
    redirect("/ideas");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: userId,
      title,
      content,
      status: "ready",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Erreur d'enregistrement du post : ${error.message}`);
  }

  // On envoie l'utilisateur vers le studio visuel de ce post.
  redirect(`/post/${data.id}`);
}
