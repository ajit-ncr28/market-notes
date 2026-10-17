import { extractYouTubeId } from "@/lib/youtube";

export function YouTubeEmbed({ url }: { url: string }) {
  const id = extractYouTubeId(url);
  if (!id) return null;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-[var(--line)] bg-black">
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
