import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        "emailVerified" TIMESTAMP,
        image TEXT
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Account" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE(provider, "providerAccountId")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Session" (
        id TEXT PRIMARY KEY,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL,
        expires TIMESTAMP NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        UNIQUE(identifier, token)
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AccessRequest" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    return NextResponse.json({ ok: true, message: "Database tables created" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
