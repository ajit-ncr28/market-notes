import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: "What this notebook is for — and what it is not.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-[680px]">
      <h1 className="font-serif text-4xl tracking-tight">About</h1>
      <div className="note-body mt-6">
        <p>
          {SITE_NAME} is a personal research notebook. I write here to slow down: to put a stock,
          a sector, or a data series into words before I decide what it means.
        </p>
        <p>
          Notes are organised by type — blog, observation, experience, or data — and tagged with a
          ticker or sector when that is useful. The point is my own understanding first. Publishing
          them just keeps the writing honest.
        </p>
        <p>
          This is not a tip sheet, a newsletter, or a recommendation engine. Nothing here is an
          offer to buy or sell a security. Markets move. My notes can be wrong. Read them as a
          record of thinking, not as advice.
        </p>
        <p>
          If a page embeds a video, it is usually a walk-through of the same note — charts, filings,
          or a sector sketch I wanted to talk through out loud.
        </p>
      </div>
    </article>
  );
}
