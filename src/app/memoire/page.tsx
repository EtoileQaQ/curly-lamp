import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { MemoireManager } from "@/components/memoire-manager";
import { getMemoryEntries } from "@/lib/memory";

export default async function MemoirePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const entries = await getMemoryEntries(userId);

  return (
    <main className="min-h-screen overflow-x-hidden bg-card pb-28 text-foreground md:pb-0">
      <AppHeader />
      <MemoireManager entries={entries} />
    </main>
  );
}
