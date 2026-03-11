"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { apiGet } from "@/lib/api";
import { useAuthSession } from "@/lib/useAuthSession";

type Application = {
  id: string;
  status: string;
  automation_status?: string;
  source_id: string;
  title: string;
  company: string;
  location: string;
};

export default function ApplicationsPage() {
  const { status: sessionStatus } = useAuthSession();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    apiGet<Application[]>(`/applications`).then(setApps);
  }, []);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-3xl text-black">Applications</h1>
        <p className="mt-2 text-sm text-black/60">{sessionStatus}</p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="space-y-3">
          {apps.length === 0 ? (
            <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/60">
              No applications yet. Approve a match to create one.
            </div>
          ) : (
            apps.map((app) => (
              <div
                key={app.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-3"
              >
                <div>
                  <div className="font-semibold text-black">{app.title}</div>
                  <div className="text-xs text-black/60">
                    {app.company} · {app.location} · {app.source_id}
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {app.status} · {app.automation_status ?? "queued"}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
