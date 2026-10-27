import { NotesExplorer } from "@/components/NotesExplorer";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { getAllNotes, toCardData } from "@/lib/notes";

export default function HomePage() {
  const notes = getAllNotes().map(toCardData);

  return (
    <div>
      <header className="mb-8 max-w-[680px]">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{SITE_NAME}</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          Research-led blog
        </h1>
        <p className="mt-3 max-w-xl text-[1.05rem] leading-relaxed text-[var(--muted)]">
          Notes on short-term market impact, selective scripts, and disciplined trading ideas.
        </p>
      </header>
      <NotesExplorer notes={notes} showPinned />
    </div>
  );
}
