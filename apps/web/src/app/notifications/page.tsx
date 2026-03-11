"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { apiGet, apiPost } from "@/lib/api";

type Notification = {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);

  const load = async () => {
    const data = await apiGet<Notification[]>("/notifications");
    setItems(data);
  };

  const markRead = async (id: string) => {
    await apiPost(`/notifications/${id}/read`, {});
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-black/10 bg-white p-8">
        <h1 className="font-display text-3xl text-black">Notifications</h1>
        <p className="mt-2 text-sm text-black/60">
          Approval requests, application updates, and automation status.
        </p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-black/60">
              No notifications yet.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold text-black">{item.type}</div>
                  <div className="text-xs text-black/60">{item.message}</div>
                </div>
                <button
                  onClick={() => markRead(item.id)}
                  className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-black"
                >
                  {item.is_read ? "Read" : "Mark read"}
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

