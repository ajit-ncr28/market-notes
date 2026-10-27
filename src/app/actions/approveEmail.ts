"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveEmail(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "No email" };

  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "ApprovedEmail" (email TEXT PRIMARY KEY)`
    );
    await prisma.$executeRawUnsafe(
      `INSERT INTO "ApprovedEmail" (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      email.toLowerCase()
    );
    revalidatePath("/admin/requests");
    return { ok: true };
  } catch (err) {
    console.error("Approve failed:", err);
    return { error: String(err) };
  }
}
