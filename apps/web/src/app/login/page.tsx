"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,106,61,0.18),_transparent_45%)] px-6">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <h1 className="font-display text-3xl text-black">Sign in</h1>
        <p className="mt-2 text-sm text-black/60">
          Use email/password or Google.
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
          <button
            onClick={() =>
              signIn("credentials", { email, password, callbackUrl: "/dashboard" })
            }
            className="w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Sign in with Email
          </button>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black"
          >
            Continue with Google
          </button>
          <div className="text-center text-xs text-black/60">
            New here?{" "}
            <Link className="font-semibold text-black" href="/register">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
