"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("resend", {
      email,
      redirect: false,
      callbackUrl: "/journal",
    });

    setLoading(false);

    if (result?.error) {
      setError("This email is not approved yet. Use the form below to request access.");
    } else {
      setSent(true);
    }
  }

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setRequestLoading(true);
    try {
      await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setRequestSent(true);
    } catch {
      setError("Could not send request. Try again.");
    }
    setRequestLoading(false);
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-serif text-3xl tracking-tight">Journal access</h1>
      <p className="mt-2 text-[var(--muted)]">
        Enter your name and email. If your email is approved, you will receive a login link.
      </p>

      {sent ? (
        <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 text-sm">
          Check your inbox for the login link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--accent)] px-5 py-2.5 text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send login link"}
          </button>
        </form>
      )}

      <div className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 text-sm">
        <p className="font-medium">Request access</p>
        <p className="mt-2 text-[var(--muted)]">
          The public notes are only part of the story. The private Journal holds the trade details, observations, and live thinking behind selective positions. Access is given on request only.
        </p>

        {requestSent ? (
          <p className="mt-4 text-sm text-green-700">Request sent. You will be contacted if approved.</p>
        ) : (
          <form onSubmit={handleRequest} className="mt-4 space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Short note on why you want access (optional)"
              rows={3}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
            />
            <button
              type="submit"
              disabled={requestLoading || !name || !email}
              className="w-full rounded-xl border border-[var(--line)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg)] disabled:opacity-60"
            >
              {requestLoading ? "Sending…" : "Request access"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
