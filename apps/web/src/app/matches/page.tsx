"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthSession } from "@/lib/useAuthSession";

type Match = {
  id: string;
  job_id: string;
  title: string;
  company: string;
  location: string;
  score: number;
  source_id: string;
  url?: string;
  description?: string;
};

export default function MatchesPage() {
  const { status: sessionStatus } = useAuthSession();
  const [status, setStatus] = useState("Ready.");
  const [matches, setMatches] = useState<Match[]>([]);

  const load = async () => {
    const data = await apiGet<Match[]>(`/matches`);
    setMatches(data);
  };

  const recompute = async () => {
    await apiPost("/matches/recompute", {});
    await load();
    setStatus("Matches recomputed.");
  };

  const addToQueue = async (jobId: string) => {
    await apiPost("/approvals", { jobId });
    setStatus("Added to approval queue.");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-3xl text-black">Matches</h1>
        <p className="mt-2 text-sm text-black/60">{status}</p>
        <p className="mt-1 text-xs text-black/40">Session: {sessionStatus}</p>
        <button
          onClick={recompute}
          className="mt-4 rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black"
        >
          Recompute Matches
        </button>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="space-y-3">
          {matches.length === 0 ? (
            <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/60">
              No matches yet. Upload a resume and add skills first.
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-3"
              >
                <div>
                  <div className="font-semibold text-black">{match.title}</div>
                  <div className="text-xs text-black/60">
                    {match.company} · {match.location} · {match.source_id}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {match.score}% match
                  </span>
                  {match.url ? (
                    <a
                      href={match.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-black"
                    >
                      Reference
                    </a>
                  ) : null}
                  <a
                    href={`/jobs/${match.job_id}`}
                    className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-black"
                  >
                    See details
                  </a>
                  <button
                    onClick={() => addToQueue(match.job_id)}
                    className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white"
                  >
                    Add to Queue
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
