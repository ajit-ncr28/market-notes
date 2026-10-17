import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes().map((note) => ({
    url: `https://marketnotes.local/notes/${note.slug}`,
    lastModified: note.date,
  }));

  return [
    { url: "https://marketnotes.local" },
    { url: "https://marketnotes.local/archive" },
    { url: "https://marketnotes.local/videos" },
    { url: "https://marketnotes.local/about" },
    ...notes,
  ];
}
