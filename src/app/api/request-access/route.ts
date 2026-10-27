import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    // Store the request
    await prisma.$executeRawUnsafe(
      `INSERT INTO "AccessRequest" (id, name, email, message, "createdAt") VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT DO NOTHING`,
      crypto.randomUUID(),
      name,
      email,
      message || ""
    );

    // Notify owner
    await resend.emails.send({
      from: "BullVeda <login@bullveda.com>",
      to: "ajit772021@gmail.com",
      subject: "New Journal access request",
      html: `<p><strong>${name}</strong> (${email}) requested access.</p><p>${message || "No message"}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
