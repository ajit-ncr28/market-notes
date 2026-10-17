# Market Notes

A simple, mobile-first personal journal for stock and sector research. Built with Next.js (App Router), Tailwind CSS, and Markdown files. No CMS, no database, no login.

Replace `YOUR_YOUTUBE_CHANNEL_URL` in `src/lib/constants.ts` before you run the site.

## Scripts

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Add a new note

1. Create a Markdown file in `content/notes/`.
2. Use a slug-style filename, for example `infy-attrition-watch.md`.
3. Start the file with frontmatter:

```md
---
title: A clear title
date: 2026-09-18
type: observation
stock: INFY
sector: IT
tags: [attrition, margins]
youtube:
summary: One or two lines that will show on the card.
---

Your note in Markdown.
```

### Frontmatter fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Shown on cards and the detail page |
| `date` | yes | `YYYY-MM-DD` |
| `type` | yes | `blog` \| `observation` \| `experience` \| `data` |
| `summary` | yes | 1–2 lines |
| `stock` | no | Ticker, e.g. `RELIANCE` |
| `sector` | no | Banking, IT, Auto, Pharma, Energy, Metals, FMCG, Infra |
| `tags` | no | YAML array |
| `youtube` | no | Full YouTube URL; embeds on the note and Videos page |
| `pinned` | no | `true` pins the note on the home page |

Drop the file and refresh. In production, `npm run build` generates pages from whatever files are in `content/notes`.

## Pages

- `/` — latest notes, search, type and sector filters
- `/notes/[slug]` — full note, optional video, related notes
- `/archive` — all notes with filter and date sort
- `/videos` — notes that have a YouTube link
- `/about` — what this notebook is (and is not)

## Design notes

Palette lives in `src/app/globals.css`: paper `#F3EFE6`, cream `#FFFDF8`, ink `#1C1A16`, forest `#1F4A3C`. The theme toggle stores `light` or `dark` in `localStorage`.
