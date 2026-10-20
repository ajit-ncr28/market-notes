import type { Metadata } from "next";
import { NotesExplorer } from "@/components/NotesExplorer";
import { SITE_TAGLINE } from "@/lib/constants";
import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: SITE_TAGLINE,
};

export default function HomePage() {
  const notes = getAllNotes();

  return (
    <div>
      <header className="mb-8 max-w-[680px]">
        <h1 className="font-serif text-4xl tracking-tight">Market Notes</h1>
        <p className="mt-3 text-[var(--muted)]">{SITE_TAGLINE}</p>
      </header>

      <NotesExplorer notes={notes} />
    </div>
  );
}
