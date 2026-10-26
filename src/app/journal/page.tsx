import type { Metadata } from "next";
import { JournalContent } from "@/components/JournalContent";
import { getAllNotes, toCardData } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Journal",
  description: "Personal daily notes, trades and snapshots. Some notes can be made public anytime.",
};

export default function JournalPage() {
  const notes = getAllNotes()
    .filter((note) => note.type === "trade" || note.type === "snapshot" || note.type === "blog")
    .map(toCardData);

  return (
    <div>
      <header className="mb-8 max-w-[680px]">
        <h1 className="font-serif text-4xl tracking-tight">Journal</h1>
        <p className="mt-3 text-[var(--muted)]">
          Daily notes, trade details and snapshots. After unlocking, use the toggle on any note to make it public or private.
        </p>
      </header>
      <JournalContent notes={notes} />
    </div>
  );
}
