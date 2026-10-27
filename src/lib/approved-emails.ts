import { prisma } from "./prisma";

// Hardcoded emails (always approved)
const HARDCODED = [
  "ajit772021@gmail.com",
  "ajit72021@gmail.com",
  "ajit772025@gmail.com",
];

export async function isApprovedEmail(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const lower = email.toLowerCase();
  if (HARDCODED.includes(lower)) return true;

  try {
    const result = await prisma.$queryRawUnsafe<Array<{ email: string }>>(
      `SELECT email FROM "ApprovedEmail" WHERE email = $1 LIMIT 1`,
      lower
    );
    return result.length > 0;
  } catch {
    return false;
  }
}
