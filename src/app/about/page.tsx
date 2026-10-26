import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: "SEBI-unregistered Research Analyst and full-time trader focused on selective equities, ETFs, mutual funds, SIPs and long-term financial planning.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-[680px]">
      <h1 className="font-serif text-4xl tracking-tight">About {SITE_NAME}</h1>
      <div className="note-body mt-6">
        <p>
          I am a full-time trader and a SEBI-unregistered Research Analyst. I spend my days studying selective Indian stocks, sectors, ETFs and mutual funds — writing notes so my thinking stays clear and disciplined.
        </p>
        <p>
          {SITE_NAME} is where I publish the research that survives that process. The notes are organised by type and tagged with a ticker or sector when useful. The goal is better understanding first.
        </p>
        <p>
          As an IIFL sub-broker, I also help with account setup and execution when clients want to act on their own research or on ideas we discuss. I do not give tips or guaranteed returns. Markets move and any view can be wrong.
        </p>
        <p>
          If you are looking to grow money through equities, ETFs, SIPs, mutual funds, or structured products such as PMS and AIF, and you prefer a calm, research-led approach, you are welcome to read the notes.
        </p>
        <p>
          Nothing on this site is investment advice or an offer to buy or sell any security. Read the notes as a record of one trader’s thinking.
        </p>
      </div>
    </article>
  );
}
