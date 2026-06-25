import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { VisualStudio } from "@/components/visual-studio";

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  // On charge le post (en s'assurant qu'il appartient bien à l'utilisateur).
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, title, content")
    .eq("id", params.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (postError) {
    console.error("[post/[id]] lecture post", postError);
  }

  if (!post) {
    notFound();
  }

  // On récupère les couleurs de marque définies à l'onboarding.
  const { data: profile } = await supabase
    .from("profiles")
    .select("brand_primary, brand_secondary")
    .eq("user_id", userId)
    .maybeSingle();

  return (
    <VisualStudio
      post={post}
      brandPrimary={profile?.brand_primary ?? "#4f46e5"}
      brandSecondary={profile?.brand_secondary ?? "#0ea5e9"}
    />
  );
}
