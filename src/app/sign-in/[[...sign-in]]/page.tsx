import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#12101f] px-6 py-12">
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#6c63ff]/20 blur-3xl" />
      <div className="relative rounded-3xl border border-[#2a2450] bg-white p-2 shadow-2xl shadow-[#6c63ff]/10">
        <SignIn />
      </div>
    </main>
  );
}
