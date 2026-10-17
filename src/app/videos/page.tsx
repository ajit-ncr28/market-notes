import type { Metadata } from "next";
import Link from "next/link";
import { TypeBadge } from "@/components/TypeBadge";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { YOUTUBE_CHANNEL_URL } from "@/lib/constants";
import { getVideoNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Videos",
  description: "Notes that include a walk-through video.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function VideosPage() {
  const notes = getVideoNotes();

  return (
    <div>
      <header className="mb-8 max-w-[680px]">
        <h1 className="font-serif text-4xl tracking-tight">Videos</h1>
        <p className="mt-3 text-[var(--muted)]">
          Every note that carries a YouTube link. Longer conversations live on the{" "}
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            channel
          </a>
          .
        </p>
      </header>

      {notes.length === 0 ? (
        <p className="text-[var(--muted)]">No video notes yet.</p>
      ) : (
        <div className="grid gap-10">
          {notes.map((note) => (
            <section key={note.slug} className="max-w-[680px]">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                <TypeBadge type={note.type} />
                <time dateTime={note.date}>{formatDate(note.date)}</time>
                {note.stock ? <span>{note.stock}</span> : null}
                {note.sector ? <span>{note.sector}</span> : null}
              </div>
              <h2 className="font-serif text-2xl leading-snug">
                <Link href={`/notes/${note.slug}`} className="hover:text-[var(--accent)]">
                  {note.title}
                </Link>
              </h2>
              <p className="mt-2 text-[var(--muted)]">{note.summary}</p>
              {note.youtube ? <YouTubeEmbed url={note.youtube} /> : null}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
