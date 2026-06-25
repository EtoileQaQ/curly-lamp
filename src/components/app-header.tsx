"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Brain, Hash, LayoutDashboard, PenLine, Repeat2 } from "lucide-react";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { label: "Mes posts", href: "/dashboard" },
  { label: "Nouveau post", href: "/ideas" },
  { label: "Repurposing", href: "/repurposing" },
  { label: "Mémoire", href: "/memoire" },
  { label: "Mes thèmes", href: "/mes-themes" },
];

const MOBILE_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Générer", href: "/ideas", icon: PenLine },
  { label: "Repurpose", href: "/repurposing", icon: Repeat2 },
  { label: "Mémoire", href: "/memoire", icon: Brain },
  { label: "Thèmes", href: "/mes-themes", icon: Hash },
];

// En-tête commun aux pages de l'application (dashboard, ideas, etc.), aligné
// sur la DA de la landing.
export function AppHeader() {
  const pathname = usePathname();
  const [hasStripeCustomer, setHasStripeCustomer] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSubscriptionStatus() {
      try {
        const res = await fetch("/api/subscription-status", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) {
          setHasStripeCustomer(Boolean(data.hasStripeCustomer));
        }
      } catch {
        // Le bouton est seulement un raccourci : en cas d'échec, on le masque.
      }
    }

    loadSubscriptionStatus();
    return () => {
      mounted = false;
    };
  }, []);

  function isActive(href: string) {
    if (href === "/ideas") {
      return pathname === "/ideas" || pathname.startsWith("/write");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-border bg-background md:block">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {/* Zone gauche : logo */}
          <div className="flex-1">
            <Link href="/dashboard" className="text-xl font-bold tracking-tight">
              <span className="text-primary">Echo</span>
            </Link>
          </div>

          {/* Zone centrale : liens (centrés) */}
          <nav className="flex flex-1 items-center justify-center gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-sm font-medium transition ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Zone droite : gestion d'abonnement + compte */}
          <div className="flex flex-1 items-center justify-end gap-3 pl-8">
            {hasStripeCustomer && <ManageSubscriptionButton />}
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </header>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur md:hidden">
        <div className="flex h-14 items-center justify-between gap-6 px-4">
          <Link
            href="/dashboard"
            className="flex-1 text-lg font-bold tracking-tight"
          >
            <span className="text-primary">Echo</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9",
                },
              }}
            />
          </div>
        </div>
      </header>

      <nav className="fixed bottom-3 left-3 right-3 z-50 flex h-[64px] items-center justify-around rounded-2xl border border-border bg-card/95 shadow-xl backdrop-blur md:hidden">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-full flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-[22px] w-[22px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
