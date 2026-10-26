"use server";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export async function toggleNotePublic(slug: string) {
  const mdPath = path.join(NOTES_DIR, `${slug}.md`);
  const mdxPath = path.join(NOTES_DIR, `${slug}.mdx`);
  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null;

  if (!filePath) {
    throw new Error("Note not found");
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const current = data.public === true;
  data.public = !current;

  const updated = matter.stringify(content, data);
  fs.writeFileSync(filePath, updated, "utf8");

  revalidatePath("/journal");
  revalidatePath("/");
  revalidatePath(`/notes/${slug}`);

  return { success: true, public: data.public };
}
