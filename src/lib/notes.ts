import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToHtml } from "./markdown";
import type { Note, NoteFrontmatter } from "./types";
import type { NoteType } from "./constants";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

function isNoteType(value: unknown): value is NoteType {
  return (
    value === "blog" ||
    value === "observation" ||
    value === "experience" ||
    value === "data" ||
    value === "trade" ||
    value === "snapshot"
  );
}

function toDateString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return null;
}

function parseFrontmatter(data: Record<string, unknown>, slug: string): NoteFrontmatter {
  if (typeof data.title !== "string") {
    throw new Error(`Note "${slug}" is missing title`);
  }
  const date = toDateString(data.date);
  if (!date) {
    throw new Error(`Note "${slug}" is missing date`);
  }
  if (!isNoteType(data.type)) {
    throw new Error(`Note "${slug}" has invalid type`);
  }
  if (typeof data.summary !== "string") {
    throw new Error(`Note "${slug}" is missing summary`);
  }

  return {
    title: data.title,
    date,
    type: data.type,
    stock: typeof data.stock === "string" ? data.stock : undefined,
    sector: typeof data.sector === "string" ? data.sector : undefined,
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    youtube: typeof data.youtube === "string" ? data.youtube : undefined,
    summary: data.summary,
    pinned: data.pinned === true,
    event: typeof data.event === "string" ? data.event : undefined,
    public: data.public === true,
  };
}

export function getNoteSlugs(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

export function getNoteBySlug(slug: string): Note | null {
  const mdPath = path.join(NOTES_DIR, `${slug}.md`);
  const mdxPath = path.join(NOTES_DIR, `${slug}.mdx`);
  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = parseFrontmatter(data, slug);

  return {
    ...frontmatter,
    slug,
    content,
    html: "",
  };
}

export async function getNoteWithHtml(slug: string): Promise<Note | null> {
  const note = getNoteBySlug(slug);
  if (!note) return null;
  return { ...note, html: await markdownToHtml(note.content) };
}

export function getAllNotes(): Note[] {
  return getNoteSlugs()
    .map((slug) => getNoteBySlug(slug))
    .filter((note): note is Note => note !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRelatedNotes(note: Note, limit = 3): Note[] {
  return getAllNotes()
    .filter((candidate) => candidate.slug !== note.slug)
    .filter((candidate) => {
      const sameStock = Boolean(note.stock && candidate.stock === note.stock);
      const sameSector = Boolean(note.sector && candidate.sector === note.sector);
      return sameStock || sameSector;
    })
    .slice(0, limit);
}

export function getVideoNotes(): Note[] {
  return getAllNotes().filter((note) => Boolean(note.youtube));
}

export type NoteCardData = Omit<Note, "content" | "html">;

export function toCardData(note: Note): NoteCardData {
  const { content: _content, html: _html, ...rest } = note;
  return rest;
}
