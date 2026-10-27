// Add emails here that are allowed to view private Journal notes.
// Later this can be replaced by a database or subscription system.
export const APPROVED_EMAILS = [
  "your-email@example.com", // Replace with your own email
  // "client@example.com",
];

export function isApprovedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return APPROVED_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}
