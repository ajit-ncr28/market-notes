"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveEmail(email: string) {
  // Add to approved list by inserting into a simple table
  await prisma.$executeRawUnsafe(
    `INSERT INTO "ApprovedEmail" (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
    email.toLowerCase()
  );
  revalidatePath("/admin/requests");
}
