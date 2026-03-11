"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { apiGet, apiPost } from "@/lib/api";

type Settings = {
  auto_apply_enabled: boolean;
  daily_limit: number;
  preferred_platforms: string[];
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    auto_apply_enabled: false,
    daily_limit: 10,
    preferred_platforms: [],
  });

  useEffect(() => {
    apiGet<Settings>("/settings").then(setSettings);
  }, []);

  const save = async () => {
    const updated = await apiPost<Settings>("/settings", settings);
    setSettings(updated);
  };

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-3xl text-black">Settings</h1>
        <p className="mt-2 text-sm text-black/60">
          Configure approvals, automation, and notifications.
        </p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="space-y-4">
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-3">
            <span className="text-sm text-black">Auto‑apply enabled</span>
            <input
              type="checkbox"
              checked={settings.auto_apply_enabled}
              onChange={(e) =>
                setSettings({ ...settings, auto_apply_enabled: e.target.checked })
              }
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-3">
            <span className="text-sm text-black">Daily apply limit</span>
            <input
              type="number"
              className="w-20 rounded-md border border-black/15 px-2 py-1 text-sm"
              value={settings.daily_limit}
              onChange={(e) =>
                setSettings({ ...settings, daily_limit: Number(e.target.value) })
              }
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-3">
            <span className="text-sm text-black">Preferred platforms</span>
            <input
              type="text"
              className="flex-1 rounded-md border border-black/15 px-2 py-1 text-sm"
              placeholder="Naukri, LinkedIn"
              value={settings.preferred_platforms.join(", ")}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  preferred_platforms: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>
        </div>
        <button
          onClick={save}
          className="mt-4 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white"
        >
          Save Settings
        </button>
      </section>
    </DashboardShell>
  );
}
