import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import { Resend as ResendClient } from "resend";

const resend = new ResendClient(process.env.AUTH_RESEND_KEY);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    Resend({
      from: "BullVeda <login@bullveda.com>",
      async sendVerificationRequest({ identifier: email, url }) {
        await resend.emails.send({
          from: "BullVeda <login@bullveda.com>",
          to: email,
          subject: "Your BullVeda Journal login link",
          html: `<p>Click the link below to access the Journal:</p><p><a href="${url}">${url}</a></p><p>This link expires in 24 hours.</p>`,
        });
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
