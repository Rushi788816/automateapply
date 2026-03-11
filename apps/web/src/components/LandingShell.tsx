"use client";

import Link from "next/link";

export default function LandingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,106,61,0.18),_transparent_45%),radial-gradient(circle_at_20%_20%,_rgba(47,91,255,0.12),_transparent_40%)]">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
            AA
          </div>
          <div>
            <div className="font-display text-lg text-black">AutomateApply</div>
            <div className="text-xs text-black/60">
              Approval‑first automation
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black"
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white"
            href="/register"
          >
            Create account
          </Link>
        </div>
      </header>
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-6 lg:px-12">
        {children}
      </main>
    </div>
  );
}

