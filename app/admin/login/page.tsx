"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#fbf8f1] px-4 text-[#1d1a16]">
      <form
        className="w-full max-w-sm rounded-lg border border-[#eee8de] bg-[#fffdfa] p-6 shadow-[0_14px_38px_rgba(29,26,22,0.05)]"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-4 text-lg font-bold">Admin login</h1>
        <label className="grid gap-1.5">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#8a6a44]">
            Password
          </span>
          <input
            autoFocus
            className="w-full rounded-md border border-[#eee8de] bg-white px-2.5 py-2 text-sm outline-none focus:border-[#a88961]"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        {error ? <p className="mt-3 text-sm text-[#9a3a24]">{error}</p> : null}

        <button
          className="mt-4 w-full rounded-md bg-[#1d1a16] px-4 py-2 text-sm font-semibold text-white hover:bg-[#332e27] disabled:opacity-50"
          disabled={submitting || password.length === 0}
          type="submit"
        >
          {submitting ? "Checking…" : "Log in"}
        </button>
      </form>
    </main>
  );
}
