"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveEmail(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return;

  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "ApprovedEmail" (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      email.toLowerCase()
    );
  } catch (err) {
    console.error("Approve failed:", err);
  }
  revalidatePath("/admin/requests");
}
