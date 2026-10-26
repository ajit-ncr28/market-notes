"use client";

import { useEffect, useState, useTransition } from "react";
import { NotesExplorer } from "./NotesExplorer";
import { toggleNotePublic } from "@/app/actions/togglePublic";
import type { NoteCardData } from "@/lib/notes";

const CORRECT_PASSWORD = "bullveda2026"; // Change this anytime

export function JournalContent({ notes }: { notes: NoteCardData[] }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const saved = localStorage.getItem("bullveda-journal-unlocked");
    if (saved === "true") setUnlocked(true);
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim() === CORRECT_PASSWORD) {
      localStorage.setItem("bullveda-journal-unlocked", "true");
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  function handleToggle(slug: string) {
    startTransition(async () => {
      try {
        await toggleNotePublic(slug);
        window.location.reload();
      } catch (err) {
        alert("Could not update note. This works best when running the site locally.");
      }
    });
  }

  const publicNotes = notes.filter((n) => n.public === true);
  const privateNotes = notes.filter((n) => n.public !== true);

  if (checking) {
    return <div className="py-10 text-center text-[var(--muted)]">Loading…</div>;
  }

  return (
    <div>
      {publicNotes.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 font-serif text-2xl">Public notes</h2>
          <NotesExplorer
            notes={publicNotes}
            showToggle={unlocked}
            onToggle={unlocked ? handleToggle : undefined}
          />
        </div>
      )}

      {privateNotes.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif text-2xl">Private notes</h2>
          {unlocked ? (
            <NotesExplorer
              notes={privateNotes}
              showToggle
              onToggle={handleToggle}
            />
          ) : (
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <p className="text-[var(--muted)]">
                These notes are private. Enter the password to view them.
              </p>
              <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-sm">
                <input
                  type="password"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
                />
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-white transition hover:opacity-90"
                >
                  Unlock private notes
                </button>
              </form>
              <p className="mt-3 text-xs text-[var(--muted)]">
                Password is remembered only in this browser.
              </p>
            </div>
          )}
        </div>
      )}

      {publicNotes.length === 0 && privateNotes.length === 0 && (
        <p className="text-[var(--muted)]">No journal notes yet.</p>
      )}

      {isPending && (
        <p className="mt-4 text-sm text-[var(--muted)]">Updating…</p>
      )}
    </div>
  );
}
