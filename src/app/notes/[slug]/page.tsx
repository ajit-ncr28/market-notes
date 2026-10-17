import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TypeBadge } from "@/components/TypeBadge";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { SITE_NAME } from "@/lib/constants";
import { getNoteSlugs, getNoteWithHtml, getRelatedNotes, toCardData } from "@/lib/notes";
import { NoteCard } from "@/components/NoteCard";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function generateStaticParams() {
  return getNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteWithHtml(slug);
  if (!note) return { title: "Note" };

  return {
    title: note.title,
    description: note.summary,
    openGraph: {
      title: note.title,
      description: note.summary,
      type: "article",
      publishedTime: note.date,
      siteName: SITE_NAME,
      tags: note.tags,
    },
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = await getNoteWithHtml(slug);
  if (!note) notFound();

  const related = getRelatedNotes(note).map(toCardData);

  return (
    <article className="mx-auto max-w-[680px]">
      <Link
        href="/"
        className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
      >
        ← Back to notes
      </Link>

      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <TypeBadge type={note.type} />
          <time dateTime={note.date}>{formatDate(note.date)}</time>
        </div>
        <h1 className="mt-3 font-serif text-[2.15rem] leading-tight tracking-tight sm:text-5xl">
          {note.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {note.stock ? (
            <Link
              href={`/?stock=${encodeURIComponent(note.stock)}`}
              className="rounded-full bg-[var(--chip)] px-3 py-1 text-[var(--text)] hover:text-[var(--accent)]"
            >
              {note.stock}
            </Link>
          ) : null}
          {note.sector ? (
            <Link
              href={`/?sector=${encodeURIComponent(note.sector)}`}
              className="rounded-full border border-[var(--line)] px-3 py-1 text-[var(--muted)] hover:text-[var(--accent)]"
            >
              {note.sector}
            </Link>
          ) : null}
          {note.tags?.map((tag) => (
            <span key={tag} className="rounded-full px-2 py-1 text-[var(--muted)]">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {note.youtube ? <YouTubeEmbed url={note.youtube} /> : null}

      <div className="note-body mt-8" dangerouslySetInnerHTML={{ __html: note.html }} />

      {related.length > 0 ? (
        <section className="mt-14 border-t border-[var(--line)] pt-8">
          <h2 className="mb-4 font-serif text-2xl">Related notes</h2>
          <div className="grid gap-4">
            {related.map((item) => (
              <NoteCard key={item.slug} note={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
