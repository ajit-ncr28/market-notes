"use client";

import { useTransition } from "react";
import { NotesExplorer } from "./NotesExplorer";
import { toggleNotePublic } from "@/app/actions/togglePublic";
import type { NoteCardData } from "@/lib/notes";

export function JournalContent({ notes }: { notes: NoteCardData[] }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle(slug: string) {
    startTransition(async () => {
      try {
        await toggleNotePublic(slug);
        window.location.reload();
      } catch (err) {
        alert("Could not update note.");
      }
    });
  }

  const publicNotes = notes.filter((n) => n.public === true);
  const privateNotes = notes.filter((n) => n.public !== true);

  return (
    <div>
      {publicNotes.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 font-serif text-2xl">Public notes</h2>
          <NotesExplorer notes={publicNotes} showToggle onToggle={handleToggle} />
        </div>
      )}

      {privateNotes.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif text-2xl">Private notes</h2>
          <NotesExplorer notes={privateNotes} showToggle onToggle={handleToggle} />
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
