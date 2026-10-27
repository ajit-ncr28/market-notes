import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { JournalContent } from "@/components/JournalContent";
import { getAllNotes, toCardData } from "@/lib/notes";
import { auth } from "@/auth";
import { isApprovedEmail } from "@/lib/approved-emails";

export const metadata: Metadata = {
  title: "Journal",
  description: "Personal daily notes, trades and snapshots. Some notes can be made public anytime.",
};

export default async function JournalPage() {
  const session = await auth();
  const isApproved = isApprovedEmail(session?.user?.email);

  if (!session || !isApproved) {
    redirect("/login");
  }

  const notes = getAllNotes()
    .filter((note) =>
      ["blog", "news", "strategy", "snapshot", "event"].includes(note.type)
    )
    .map(toCardData);

  return (
    <div>
      <header className="mb-8 max-w-[680px]">
        <h1 className="font-serif text-4xl tracking-tight">Journal</h1>
        <p className="mt-3 text-[var(--muted)]">
          Daily notes, trade details and snapshots. Use the toggle on any note to make it public or private.
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Logged in as {session.user?.email}
        </p>
      </header>
      <JournalContent notes={notes} />
    </div>
  );
}
