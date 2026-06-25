import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { RepurposeStudio } from "@/components/repurpose-studio";

export default async function RepurposingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return <RepurposeStudio />;
}
