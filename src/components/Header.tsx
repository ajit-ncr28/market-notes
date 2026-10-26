import Link from "next/link";
import { SITE_NAME, YOUTUBE_CHANNEL_URL } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Notes" },
  { href: "/journal", label: "Journal" },
  { href: "/calculators", label: "Calculators" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-serif text-xl tracking-tight text-[var(--text)]">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-2.5 py-1 text-[var(--muted)] transition hover:bg-[var(--chip)] hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full px-2.5 py-1 text-[var(--muted)] transition hover:text-[var(--accent)] sm:inline"
          >
            Channel
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
