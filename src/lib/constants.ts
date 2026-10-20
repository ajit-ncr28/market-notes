export const SITE_NAME = "Market Notes";
export const SITE_TAGLINE =
  "My notes on stocks, sectors, and what the data actually means.";
export const SITE_DESCRIPTION =
  "A personal research notebook on Indian stocks, sectors, and market data. Not investment advice.";

/** Replace this with your channel URL before running the site. */
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@BullvedaByAjit";

export const NOTE_TYPES = ["blog", "observation", "experience", "data"] as const;
export type NoteType = (typeof NOTE_TYPES)[number];

export const SECTORS = [
  "Banking",
  "IT",
  "Auto",
  "Pharma",
  "Energy",
  "Metals",
  "FMCG",
  "Infra",
] as const;
export type Sector = (typeof SECTORS)[number];

export const TYPE_LABELS: Record<NoteType, string> = {
  blog: "Blog",
  observation: "Observation",
  experience: "Experience",
  data: "Data",
};
