import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  try {
    const resend = new Resend(process.env.AUTH_RESEND_KEY);
    const result = await resend.emails.send({
      from: "BullVeda <login@bullveda.com>",
      to: "ajit772021@gmail.com",
      subject: "BullVeda test email",
      html: "<p>This is a test email from BullVeda login system.</p>",
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
