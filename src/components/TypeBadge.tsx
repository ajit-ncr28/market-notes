import type { NoteType } from "@/lib/constants";
import { TYPE_LABELS } from "@/lib/constants";

const BADGE_CLASS: Record<NoteType, string> = {
  blog: "bg-[#e7efe8] text-[#1f4a3c] dark:bg-[#24362f] dark:text-[#c5ddd2]",
  observation: "bg-[#efe8d8] text-[#5a4a28] dark:bg-[#3a3324] dark:text-[#e2d3b0]",
  experience: "bg-[#eadfd8] text-[#5a3b2e] dark:bg-[#3a2c26] dark:text-[#e0c7bb]",
  data: "bg-[#dde4ea] text-[#2d4254] dark:bg-[#27333c] dark:text-[#c5d5e2]",
  trade: "bg-[#e8f0e7] text-[#1f4a3c] dark:bg-[#24362f] dark:text-[#c5ddd2]",
  snapshot: "bg-[#f0e8d8] text-[#5a4a28] dark:bg-[#3a3324] dark:text-[#e2d3b0]",
};

export function TypeBadge({ type }: { type: NoteType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase ${BADGE_CLASS[type]}`}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}
