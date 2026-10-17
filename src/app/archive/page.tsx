import type { Metadata } from "next";
import { NotesExplorer } from "@/components/NotesExplorer";
import { getAllNotes, toCardData } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Archive",
  description: "All research notes, filterable by type, sector, and stock.",
};

export default function ArchivePage() {
  const notes = getAllNotes().map(toCardData);

  return (
    <div>
      <header className="mb-8 max-w-[680px]">
        <h1 className="font-serif text-4xl tracking-tight">Archive</h1>
        <p className="mt-3 text-[var(--muted)]">
          Every note in one place. Filter by type or sector, sort by date, and click a ticker to
          narrow the list.
        </p>
      </header>
      <NotesExplorer notes={notes} />
    </div>
  );
}
