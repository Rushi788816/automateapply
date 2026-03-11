import Link from "next/link";
import LandingShell from "@/components/LandingShell";

export default function Home() {
  return (
    <LandingShell>
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="animate-fade-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1 text-xs uppercase tracking-[0.2em] text-black/70">
            Automation Studio
          </div>
          <h1 className="font-display text-4xl leading-tight text-black md:text-6xl">
            Apply to the right jobs, with your approval at every step.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-black/70">
            Automate job discovery, ranking, and applications while keeping you
            in control of every submit.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-black"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <div className="font-display text-2xl text-black">What you get</div>
          <ul className="mt-4 space-y-3 text-sm text-black/70">
            <li>Resume parsing + skill extraction</li>
            <li>AI‑assisted job matching</li>
            <li>Approval queue before any apply</li>
            <li>Automation runner with audit trail</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Upload Resume",
            text: "PDF/DOCX supported. We extract skills, titles, and seniority.",
          },
          {
            title: "Confirm Skills",
            text: "Tune the match engine with your real skill set.",
          },
          {
            title: "Approve & Apply",
            text: "Every application is reviewed before automation runs.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
          >
            <div className="font-display text-xl text-black">{card.title}</div>
            <p className="mt-3 text-sm text-black/70">{card.text}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-2xl text-black">Ready?</div>
            <p className="text-sm text-black/60">
              Create an account to unlock your dashboard.
            </p>
          </div>
          <Link
            href="/register"
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Get started
          </Link>
        </div>
      </section>
    </LandingShell>
  );
}

