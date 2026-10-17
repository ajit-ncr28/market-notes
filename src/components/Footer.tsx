import { YOUTUBE_CHANNEL_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Personal research notes. Not investment advice.</p>
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--accent)] underline-offset-4 hover:underline"
        >
          YouTube channel
        </a>
      </div>
    </footer>
  );
}
