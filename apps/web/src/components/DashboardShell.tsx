"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/matches", label: "Matches" },
  { href: "/approvals", label: "Approvals" },
  { href: "/applications", label: "Applications" },
  { href: "/notifications", label: "Notifications" },
  { href: "/connectors", label: "Connectors" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data } = useSession();
  const email = (data?.user as any)?.email ?? "user";
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,106,61,0.18),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(47,91,255,0.12),_transparent_40%)]">
      <header className="sticky top-0 z-10 border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
              {initials}
            </div>
            <div>
              <div className="font-display text-lg text-black">
                AutomateApply
              </div>
              <div className="text-xs text-black/60">{email}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl flex-wrap gap-2 px-6 pb-4">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  active
                    ? "bg-black text-white"
                    : "border border-black/10 bg-white text-black/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:px-12">
        {children}
      </main>
    </div>
  );
}
