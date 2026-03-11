"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { apiPost } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");

  const submit = async () => {
    if (!email || !password) {
      setStatus("Email and password are required.");
      return;
    }
    if (password !== confirm) {
      setStatus("Passwords do not match.");
      return;
    }
    try {
      await apiPost("/auth/register", { email, password });
      await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
    } catch {
      setStatus("Registration failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(47,91,255,0.18),_transparent_45%)] px-6">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <h1 className="font-display text-3xl text-black">Create account</h1>
        <p className="mt-2 text-sm text-black/60">
          Set up email + password to start.
        </p>
        <div className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-full border border-black/15 px-4 py-2 text-sm"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-full border border-black/15 px-4 py-2 text-sm"
          />
          <input
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Confirm password"
            type="password"
            className="w-full rounded-full border border-black/15 px-4 py-2 text-sm"
          />
          <button
            onClick={submit}
            className="w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Create account
          </button>
          <div className="text-center text-xs text-black/60">{status}</div>
          <div className="text-center text-xs text-black/60">
            Already have an account?{" "}
            <Link className="font-semibold text-black" href="/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
