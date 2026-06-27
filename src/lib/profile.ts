import { createAdminClient } from "@/lib/supabase/admin";

export type Persona = "freelance" | "dirigeant" | "consultant" | "autre";

export type Profile = {
  id?: string;
  user_id: string;
  clerk_user_id: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  persona: Persona | null;
  first_post_idea: string | null;
  first_post_generated: string | null;
  updated_at?: string | null;
};

export type ProfileUpdate = Partial<
  Pick<
    Profile,
    | "onboarding_completed"
    | "onboarding_step"
    | "persona"
    | "first_post_idea"
    | "first_post_generated"
  >
>;

const PROFILE_SELECT =
  "id, user_id, clerk_user_id, onboarding_completed, onboarding_step, persona, first_post_idea, first_post_generated, updated_at";

function normalizeProfile(row: Partial<Profile>, clerkUserId: string): Profile {
  return {
    user_id: row.user_id ?? clerkUserId,
    clerk_user_id: row.clerk_user_id ?? clerkUserId,
    onboarding_completed: row.onboarding_completed ?? false,
    onboarding_step: row.onboarding_step ?? 0,
    persona: row.persona ?? null,
    first_post_idea: row.first_post_idea ?? null,
    first_post_generated: row.first_post_generated ?? null,
    id: row.id,
    updated_at: row.updated_at,
  };
}

export async function getOrCreateProfile(
  clerkUserId: string
): Promise<Profile> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select(PROFILE_SELECT)
    .or(`user_id.eq.${clerkUserId},clerk_user_id.eq.${clerkUserId}`)
    .maybeSingle();

  if (readError) {
    throw new Error(`Lecture du profil impossible : ${readError.message}`);
  }

  if (existing) {
    const normalized = normalizeProfile(existing as Partial<Profile>, clerkUserId);
    if (!existing.user_id || !existing.clerk_user_id) {
      await supabase
        .from("profiles")
        .update({
          user_id: normalized.user_id,
          clerk_user_id: normalized.clerk_user_id,
          updated_at: now,
        })
        .eq("id", normalized.id);
    }
    return normalized;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: clerkUserId,
      clerk_user_id: clerkUserId,
      onboarding_completed: false,
      onboarding_step: 0,
      job: "Non renseigné",
      audience: "Non renseignée",
      goal: "Premier post LinkedIn",
      sample_posts: "",
      updated_at: now,
    })
    .select(PROFILE_SELECT)
    .single();

  if (error) {
    throw new Error(`Profil introuvable : ${error.message}`);
  }

  return normalizeProfile(data as Partial<Profile>, clerkUserId);
}

export async function updateProfile(
  clerkUserId: string,
  data: ProfileUpdate
): Promise<Profile> {
  const supabase = createAdminClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({
      ...data,
      user_id: clerkUserId,
      clerk_user_id: clerkUserId,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", clerkUserId)
    .select(PROFILE_SELECT)
    .single();

  if (error) {
    throw new Error(`Mise à jour du profil impossible : ${error.message}`);
  }

  return normalizeProfile(profile as Partial<Profile>, clerkUserId);
}
