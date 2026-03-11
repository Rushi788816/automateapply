"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { apiGet, apiPost } from "@/lib/api";

type Connector = {
  id: string;
  platform: string;
  username?: string;
};

export default function ConnectorsPage() {
  const [platform, setPlatform] = useState("Naukri");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Connector[]>([]);

  const load = async () => {
    const data = await apiGet<Connector[]>("/connectors");
    setItems(data);
  };

  const save = async () => {
    await apiPost("/connectors", { platform, username, password });
    setPassword("");
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-3xl text-black">Connectors</h1>
        <p className="mt-2 text-sm text-black/60">
          Manage platform credentials and automation access.
        </p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-2xl border border-black/15 px-4 py-2 text-sm"
          >
            <option>Naukri</option>
            <option>LinkedIn</option>
            <option>Indeed</option>
          </select>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username / Email"
            className="rounded-2xl border border-black/15 px-4 py-2 text-sm"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="rounded-2xl border border-black/15 px-4 py-2 text-sm"
          />
        </div>
        <button
          onClick={save}
          className="mt-4 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white"
        >
          Save Connector
        </button>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-black/60">No connectors saved.</div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold text-black">{item.platform}</div>
                  <div className="text-xs text-black/60">{item.username}</div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Saved
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
