export const SITE_NAME = "BullVeda";
export const SITE_TAGLINE =
  "Full-time trader’s research on Indian equities, ETFs, mutual funds and long-term wealth creation.";
export const SITE_DESCRIPTION =
  "Research notes and market observations from a full-time trader and IIFL sub-broker. Focus on selective equities, ETFs, SIPs, financial planning and disciplined investing. Not investment advice.";

/** Replace this with your channel URL before running the site. */
export const YOUTUBE_CHANNEL_URL = "YOUR_YOUTUBE_CHANNEL_URL";

export const NOTE_TYPES = ["blog", "observation", "experience", "data", "trade", "snapshot"] as const;
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

export const EVENTS = [
  "Earnings",
  "Results",
  "Budget",
  "RBI Policy",
  "News",
  "Technical",
  "Other",
] as const;
export type EventType = (typeof EVENTS)[number];

export const TYPE_LABELS: Record<NoteType, string> = {
  blog: "Blog",
  observation: "Observation",
  experience: "Experience",
  data: "Data",
  trade: "Trade",
  snapshot: "Snapshot",
};
