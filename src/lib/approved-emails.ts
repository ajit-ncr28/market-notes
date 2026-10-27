// Add emails here that are allowed to view private Journal notes.
// Later this can be replaced by a database or subscription system.
export const APPROVED_EMAILS = [
  "ajit772021@gmail.com",
  "ajit72021@gmail.com",
  // "client@example.com",
];

export function isApprovedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return APPROVED_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}
