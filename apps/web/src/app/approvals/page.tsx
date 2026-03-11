"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { apiGet, apiPost } from "@/lib/api";
import { useAuthSession } from "@/lib/useAuthSession";

type Approval = {
  id: string;
  status: string;
  title: string;
  company: string;
  location: string;
  source_id: string;
};

export default function ApprovalsPage() {
  const { status: sessionStatus } = useAuthSession();
  const [status, setStatus] = useState("Ready.");
  const [approvals, setApprovals] = useState<Approval[]>([]);

  const load = async () => {
    const data = await apiGet<Approval[]>(`/approvals`);
    setApprovals(data);
  };

  const approve = async (id: string) => {
    await apiPost(`/approvals/${id}/approve`, {});
    await load();
    setStatus("Approved and queued for automation.");
  };

  const reject = async (id: string) => {
    await apiPost(`/approvals/${id}/reject`, {});
    await load();
    setStatus("Skipped.");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-3xl text-black">Approval Queue</h1>
        <p className="mt-2 text-sm text-black/60">{status}</p>
        <p className="mt-1 text-xs text-black/40">Session: {sessionStatus}</p>
        <button
          onClick={load}
          className="mt-4 rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black"
        >
          Refresh
        </button>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="space-y-3">
          {approvals.length === 0 ? (
            <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/60">
              No approvals yet. Add matches to the queue.
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
                    {item.company} · {item.location} · {item.source_id}
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
    </DashboardShell>
  );
}
