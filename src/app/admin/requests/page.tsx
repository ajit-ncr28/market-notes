import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function RequestsPage() {
  const session = await auth();
  if (!session || session.user?.email !== "ajit772021@gmail.com") {
    redirect("/login");
  }

  const requests = await prisma.$queryRawUnsafe<Array<{ id: string; name: string; email: string; message: string; createdAt: Date }>>(
    `SELECT id, name, email, message, "createdAt" FROM "AccessRequest" ORDER BY "createdAt" DESC`
  );

  return (
    <div>
      <h1 className="font-serif text-3xl">Access requests</h1>
      {requests.length === 0 ? (
        <p className="mt-4 text-[var(--muted)]">No requests yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {requests.map((r) => (
            <li key={r.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="font-medium">{r.name} — {r.email}</p>
              {r.message && <p className="mt-1 text-sm text-[var(--muted)]">{r.message}</p>}
              <p className="mt-2 text-xs text-[var(--muted)]">{new Date(r.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
