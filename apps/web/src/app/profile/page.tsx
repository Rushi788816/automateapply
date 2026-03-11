"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { apiGet } from "@/lib/api";
import { useAuthSession } from "@/lib/useAuthSession";

type UserMe = {
  id: string;
  email: string;
  org_id: string;
  created_at: string;
};

type Resume = {
  id: string;
  fileName: string;
  createdAt: string;
};

export default function ProfilePage() {
  const { status: sessionStatus } = useAuthSession();
  const [me, setMe] = useState<UserMe | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    apiGet<UserMe>("/users/me").then(setMe);
    apiGet<string[]>("/skills/users/me").then(setSkills);
    apiGet<Resume[]>("/resumes").then(setResumes);
  }, []);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-3xl text-black">Profile</h1>
        <p className="mt-2 text-sm text-black/60">
          Your account data, saved skills, and resumes.
        </p>
        <p className="mt-2 text-xs text-black/40">Session: {sessionStatus}</p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm">
            <div className="text-xs text-black/50">Email</div>
            <div className="font-semibold text-black">{me?.email ?? "-"}</div>
          </div>
          <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm">
            <div className="text-xs text-black/50">User ID</div>
            <div className="font-semibold text-black">{me?.id ?? "-"}</div>
          </div>
          <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm">
            <div className="text-xs text-black/50">Org ID</div>
            <div className="font-semibold text-black">{me?.org_id ?? "-"}</div>
          </div>
          <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm">
            <div className="text-xs text-black/50">Member since</div>
            <div className="font-semibold text-black">
              {me?.created_at ?? "-"}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <h2 className="font-display text-2xl text-black">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.length === 0 ? (
            <div className="text-sm text-black/60">No skills saved.</div>
          ) : (
            skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black"
              >
                {skill}
              </span>
            ))
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <h2 className="font-display text-2xl text-black">Resumes</h2>
        <div className="mt-4 space-y-3">
          {resumes.length === 0 ? (
            <div className="text-sm text-black/60">No resumes uploaded.</div>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold text-black">
                    {resume.fileName}
                  </div>
                  <div className="text-xs text-black/50">
                    Uploaded {resume.createdAt}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
