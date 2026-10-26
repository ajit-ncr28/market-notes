import Link from "next/link";
import { TypeBadge } from "./TypeBadge";
import type { NoteCardData } from "@/lib/notes";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function NoteCard({
  note,
  onMetaClick,
  showToggle,
  onToggle,
}: {
  note: NoteCardData;
  onMetaClick?: (kind: "stock" | "sector", value: string) => void;
  showToggle?: boolean;
  onToggle?: (slug: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/40">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <TypeBadge type={note.type} />
        <time dateTime={note.date}>{formatDate(note.date)}</time>
        {note.stock ? (
          onMetaClick ? (
            <button
              type="button"
              onClick={() => onMetaClick("stock", note.stock!)}
              className="rounded-full bg-[var(--chip)] px-2 py-0.5 hover:text-[var(--accent)]"
            >
              {note.stock}
            </button>
          ) : (
            <Link
              href={`/?stock=${encodeURIComponent(note.stock)}`}
              className="rounded-full bg-[var(--chip)] px-2 py-0.5 hover:text-[var(--accent)]"
            >
              {note.stock}
            </Link>
          )
        ) : null}
        {note.sector ? (
          onMetaClick ? (
            <button
              type="button"
              onClick={() => onMetaClick("sector", note.sector!)}
              className="rounded-full px-2 py-0.5 hover:text-[var(--accent)]"
            >
              {note.sector}
            </button>
          ) : (
            <Link
              href={`/?sector=${encodeURIComponent(note.sector)}`}
              className="rounded-full px-2 py-0.5 hover:text-[var(--accent)]"
            >
              {note.sector}
            </Link>
          )
        ) : null}
      </div>
      <h2 className="font-serif text-[1.35rem] leading-snug tracking-tight">
        <Link href={`/notes/${note.slug}`} className="hover:text-[var(--accent)]">
          {note.title}
        </Link>
      </h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--muted)]">{note.summary}</p>
      {showToggle && onToggle ? (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggle(note.slug)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              note.public
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {note.public ? "Public" : "Make public"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
