"use client";

import { useEffect, useRef, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { API_URL, apiGet, apiPost } from "@/lib/api";
import { useAuthSession } from "@/lib/useAuthSession";

type Resume = {
  id: string;
  fileName: string;
  createdAt: string;
};

export default function OnboardingPage() {
  const { status: sessionStatus, accessToken } = useAuthSession();
  const [status, setStatus] = useState("Ready.");
  const [skillsInput, setSkillsInput] = useState("");
  const [existingSkills, setExistingSkills] = useState<string[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadResume = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setStatus("Select a resume file first.");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/resumes`, {
      method: "POST",
      body: form,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    setStatus(res.ok ? "Resume uploaded." : "Resume upload failed.");
    if (res.ok) {
      apiGet<Resume[]>("/resumes").then(setResumes);
    }
  };

  const saveSkills = async () => {
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await apiPost(`/skills/users/me`, { skills });
    setExistingSkills(skills);
    setStatus("Skills saved.");
  };

  useEffect(() => {
    apiGet<string[]>("/skills/users/me")
      .then((skills) => {
        setExistingSkills(skills);
        if (skills.length > 0) {
          setSkillsInput(skills.join(", "));
        }
      })
      .catch(() => null);
    apiGet<Resume[]>("/resumes").then(setResumes).catch(() => null);
  }, []);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-3xl text-black">Onboarding</h1>
        <p className="mt-2 text-sm text-black/60">
          Complete these steps to activate matching and approvals.
        </p>
        <p className="mt-4 text-xs text-black/60">{status}</p>
        <p className="mt-1 text-xs text-black/40">Session: {sessionStatus}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <h2 className="font-display text-xl text-black">1. Upload Resume</h2>
          <p className="mt-2 text-sm text-black/60">
            PDF or DOCX. We extract skills and roles.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              className="rounded-full border border-black/15 px-4 py-2 text-xs"
            />
            <button
              onClick={uploadResume}
              className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white"
            >
              Upload Resume
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <h2 className="font-display text-xl text-black">2. Confirm Skills</h2>
          <p className="mt-2 text-sm text-black/60">
            Add comma-separated skills.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <input
              value={skillsInput}
              onChange={(event) => setSkillsInput(event.target.value)}
              placeholder="React, Node.js, AWS"
              className="rounded-full border border-black/15 px-4 py-2 text-xs"
            />
            <button
              onClick={saveSkills}
              className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black"
            >
              Save Skills
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <h2 className="font-display text-xl text-black">3. Connect Sources</h2>
          <p className="mt-2 text-sm text-black/60">
            Enable Naukri automation and keep others manual-only for now.
          </p>
          <button className="mt-4 rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-black">
            Configure Connectors
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <h2 className="font-display text-2xl text-black">Saved Data</h2>
        <div className="mt-4">
          <div className="text-xs font-semibold text-black/50">Skills</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {existingSkills.length === 0 ? (
              <span className="text-xs text-black/60">No skills yet.</span>
            ) : (
              existingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-black"
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs font-semibold text-black/50">Resumes</div>
          <div className="mt-2 space-y-2">
            {resumes.length === 0 ? (
              <span className="text-xs text-black/60">No resumes uploaded.</span>
            ) : (
              resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="rounded-2xl border border-black/10 px-3 py-2 text-xs"
                >
                  {resume.fileName}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

