"use client";

import { useEffect, useMemo, useState } from "react";
import { NOTE_TYPES, SECTORS, TYPE_LABELS, type NoteType } from "@/lib/constants";
import type { NoteCardData } from "@/lib/notes";
import { NoteCard } from "./NoteCard";

type Props = {
  notes: NoteCardData[];
  heading?: string;
  showPinned?: boolean;
  initialQuery?: string;
  initialType?: string;
  initialSector?: string;
  initialStock?: string;
};

export function NotesExplorer({
  notes,
  heading,
  showPinned = false,
  initialQuery = "",
  initialType = "all",
  initialSector = "",
  initialStock = "",
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<string>(initialType || "all");
  const [sector, setSector] = useState(initialSector);
  const [stock, setStock] = useState(initialStock);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const nextType = params.get("type");
    const nextSector = params.get("sector");
    const nextStock = params.get("stock");
    if (q) setQuery(q);
    if (nextType) setType(nextType);
    if (nextSector) setSector(nextSector);
    if (nextStock) setStock(nextStock);
  }, []);

  const stocks = useMemo(() => {
    return Array.from(new Set(notes.map((note) => note.stock).filter(Boolean) as string[])).sort();
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = notes.filter((note) => {
      if (type !== "all" && note.type !== type) return false;
      if (sector && note.sector !== sector) return false;
      if (stock && note.stock !== stock) return false;
      if (!q) return true;
      const haystack = [
        note.title,
        note.summary,
        note.stock ?? "",
        note.sector ?? "",
        ...(note.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    return [...list].sort((a, b) =>
      sort === "newest" ? (a.date < b.date ? 1 : -1) : a.date > b.date ? 1 : -1,
    );
  }, [notes, query, type, sector, stock, sort]);

  const pinned = showPinned ? notes.find((note) => note.pinned) : undefined;

  function onMetaClick(kind: "stock" | "sector", value: string) {
    if (kind === "stock") {
      setStock(value);
      setSector("");
    } else {
      setSector(value);
      setStock("");
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-[var(--line)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <div className="flex flex-col gap-3">
          <label className="block">
            <span className="sr-only">Search notes</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, ticker, sector, tags…"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-[0.95rem] outline-none ring-[var(--accent)] placeholder:text-[var(--muted)] focus:ring-2"
            />
          </label>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Chip active={type === "all"} onClick={() => setType("all")}>
              All
            </Chip>
            {NOTE_TYPES.map((item) => (
              <Chip key={item} active={type === item} onClick={() => setType(item)}>
                {TYPE_LABELS[item as NoteType]}
              </Chip>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Chip
              active={!sector}
              onClick={() => {
                setSector("");
              }}
            >
              All sectors
            </Chip>
            {SECTORS.map((item) => (
              <Chip key={item} active={sector === item} onClick={() => setSector(item)}>
                {item}
              </Chip>
            ))}
          </div>

          {stocks.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Chip active={!stock} onClick={() => setStock("")}>
                All stocks
              </Chip>
              {stocks.map((item) => (
                <Chip key={item} active={stock === item} onClick={() => setStock(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-[var(--muted)]">
            <p>
              {filtered.length} {filtered.length === 1 ? "note" : "notes"}
              {stock ? ` · ${stock}` : ""}
              {sector ? ` · ${sector}` : ""}
            </p>
            <label className="flex items-center gap-2">
              <span className="sr-only">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as "newest" | "oldest")}
                className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {pinned && type === "all" && !query && !sector && !stock ? (
        <div className="mb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Pinned</p>
          <NoteCard note={pinned} onMetaClick={onMetaClick} />
        </div>
      ) : null}

      {heading ? <h2 className="mb-4 font-serif text-2xl">{heading}</h2> : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-10 text-center text-[var(--muted)]">
          No notes match those filters.
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((note) => (
            <NoteCard key={note.slug} note={note} onMetaClick={onMetaClick} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-sm transition ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-[#fffdf8] dark:text-[#16130f]"
          : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"
      }`}
    >
      {children}
    </button>
  );
}
