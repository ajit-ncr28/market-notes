import type { NoteType } from "./constants";

export type NoteFrontmatter = {
  title: string;
  date: string;
  type: NoteType;
  stock?: string;
  sector?: string;
  tags?: string[];
  youtube?: string;
  summary: string;
  pinned?: boolean;
  event?: string;
  public?: boolean;
};

export type Note = NoteFrontmatter & {
  slug: string;
  content: string;
  html: string;
};
