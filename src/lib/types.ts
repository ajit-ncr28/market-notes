import type { NoteType, EventType } from "./constants";

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
  event?: EventType | string;
  public?: boolean;
};

export type Note = NoteFrontmatter & {
  slug: string;
  content: string;
  html: string;
};
