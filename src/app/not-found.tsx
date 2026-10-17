import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[680px] py-10">
      <h1 className="font-serif text-4xl">Note not found</h1>
      <p className="mt-3 text-[var(--muted)]">That page is not in the notebook.</p>
      <Link href="/" className="mt-6 inline-block text-[var(--accent)] underline-offset-4 hover:underline">
        Back to notes
      </Link>
    </div>
  );
}
