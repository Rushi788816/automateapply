"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { apiGet } from "@/lib/api";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  url?: string;
  source_id?: string;
};

export default function JobDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!id) return;
    apiGet<Job>(`/jobs/${id}`).then(setJob);
  }, [id]);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-3xl text-black">Job Details</h1>
        <p className="mt-2 text-sm text-black/60">
          Full information about the selected job.
        </p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        {!job ? (
          <div className="text-sm text-black/60">Loading job details…</div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="font-display text-2xl text-black">
                {job.title}
              </div>
              <div className="text-sm text-black/60">
                {job.company} · {job.location} · {job.source_id}
              </div>
            </div>
            <p className="text-sm text-black/70">
              {job.description ?? "No description available."}
            </p>
            {job.url ? (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black"
              >
                Open reference link
              </a>
            ) : null}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

