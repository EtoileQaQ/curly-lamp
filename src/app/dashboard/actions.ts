"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Non autorisé");
  }
  return userId;
}

// Change uniquement le statut d'un post (Brouillon / Prêt / Publié).
export async function setPostStatus(id: string, status: string) {
  const userId = await requireUserId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("posts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

// Met à jour le contenu (et le statut) d'un post après édition.
export async function updatePost(id: string, content: string, status: string) {
  const userId = await requireUserId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("posts")
    .update({ content, status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

// Supprime définitivement un post.
export async function deletePost(id: string) {
  const userId = await requireUserId();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
