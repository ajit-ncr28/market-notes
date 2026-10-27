"use client";

import { useState } from "react";
import { approveEmail } from "@/app/actions/approveEmail";

export function ApproveButton({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setStatus("");
    const formData = new FormData();
    formData.set("email", email);
    const result = await approveEmail(formData);
    setLoading(false);
    if (result?.ok) {
      setStatus("Approved");
    } else {
      setStatus(result?.error || "Failed");
    }
  }

  return (
    <div className="mt-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm text-white disabled:opacity-60"
      >
        {loading ? "Approving…" : "Approve"}
      </button>
      {status && <p className="mt-1 text-xs text-[var(--muted)]">{status}</p>}
    </div>
  );
}
