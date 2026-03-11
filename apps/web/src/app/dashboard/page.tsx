"use client";

import { useMemo, useRef, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { apiGet, apiPost, API_URL } from "@/lib/api";
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

type Approval = {
  id: string;
  status: string;
  title: string;
  company: string;
  location: string;
  source_id: string;
};

export default function DashboardPage() {
  const { status: sessionStatus, accessToken } = useAuthSession();
  const [status, setStatus] = useState("Ready.");
  const [skillsInput, setSkillsInput] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const resumeAction = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setStatus("Select a file first.");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/resumes`, {
      method: "POST",
      body: form,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    if (!res.ok) {
      setStatus("Resume upload failed.");
      return;
    }
    setStatus("Resume uploaded. Add skills to continue.");
  };

  const skillsAction = async () => {
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await apiPost(`/skills/users/me`, { skills });
    setStatus("Skills saved. Recompute matches.");
  };

  const recomputeMatches = async () => {
    await apiPost("/matches/recompute", {});
    const data = await apiGet<Match[]>(`/matches`);
    setMatches(data);
    setStatus("Matches updated.");
  };

  const createApproval = async (jobId: string) => {
    await apiPost("/approvals", { jobId });
    await loadApprovals();
  };

  const loadApprovals = async () => {
    const data = await apiGet<Approval[]>(`/approvals`);
    setApprovals(data);
  };

  const approve = async (id: string) => {
    await apiPost(`/approvals/${id}/approve`, {});
    await loadApprovals();
  };

  const reject = async (id: string) => {
    await apiPost(`/approvals/${id}/reject`, {});
    await loadApprovals();
  };

  const matchCount = useMemo(() => matches.length, [matches]);

  return (
    <DashboardShell>
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="animate-fade-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1 text-xs uppercase tracking-[0.2em] text-black/70">
            Automation Studio
          </div>
          <h1 className="font-display text-4xl leading-tight text-black md:text-6xl">
            Apply to the right jobs, with your approval at every step.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-black/70">
            Upload your resume, confirm your skills, and let the platform
            surface the best matches. Approve each application before the
            automation runs.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs"
            />
            <button
              onClick={resumeAction}
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
            >
              Upload Resume
            </button>
            <button
              onClick={recomputeMatches}
              className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-black"
            >
              Review Matches
            </button>
            <button
              onClick={() => apiPost("/jobs/seed", {})}
              className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-black"
            >
              Seed Sample Jobs
            </button>
          </div>
          <p className="mt-3 text-xs text-black/60">{status}</p>
          <p className="mt-1 text-xs text-black/40">
            Session: {sessionStatus}
          </p>
        </div>

        <div className="animate-float rounded-3xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-black/70">
              Live Matching
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {matchCount} matches
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {matches.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 text-sm text-black/60">
                No matches yet. Upload resume and add skills.
              </div>
            ) : (
              matches.slice(0, 3).map((match) => (
                <div
                  key={match.id}
                  className="rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3"
                >
                  <div className="font-semibold text-black">{match.title}</div>
                  <div className="text-sm text-black/60">{match.location}</div>
                  <div className="mt-2 text-xs font-semibold text-black/80">
                    {match.score}% match
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "1. Upload Resume",
            text: "PDF/DOCX supported. We extract skills, titles, and seniority.",
          },
          {
            title: "2. Confirm Skills",
            text: "Add or remove skills to tune the match engine precisely.",
          },
          {
            title: "3. Connect Platforms",
            text: "Attach job boards and set approvals before automation.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
          >
            <div className="font-display text-xl text-black">{card.title}</div>
            <p className="mt-3 text-sm text-black/70">{card.text}</p>
            {card.title.includes("Confirm Skills") ? (
              <div className="mt-5 flex flex-col gap-2">
                <input
                  value={skillsInput}
                  onChange={(event) => setSkillsInput(event.target.value)}
                  placeholder="React, Node.js, AWS"
                  className="rounded-full border border-black/15 px-4 py-2 text-xs"
                />
                <button
                  onClick={skillsAction}
                  className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black"
                >
                  Save Skills
                </button>
              </div>
            ) : (
              <button className="mt-5 rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black">
                Configure
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-black">
              Approval Queue
            </h2>
            <p className="text-sm text-black/60">
              Applications will only run after you approve.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadApprovals}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white"
            >
              Refresh Queue
            </button>
            <button className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black">
              Pause Automation
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {approvals.length === 0 ? (
            <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/60">
              No approvals yet. Create approvals from matches below.
            </div>
          ) : (
            approvals.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-3"
              >
                <div>
                  <div className="font-semibold text-black">{item.title}</div>
                  <div className="text-xs text-black/60">
                    {item.source_id} · {item.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {item.status}
                  </span>
                  <button
                    onClick={() => approve(item.id)}
                    className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(item.id)}
                    className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-black"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-black">Matches</h2>
          <button
            onClick={recomputeMatches}
            className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black"
          >
            Recompute
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {matches.length === 0 ? (
            <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/60">
              No matches yet. Add skills and recompute.
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
                    onClick={() => createApproval(match.job_id)}
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
