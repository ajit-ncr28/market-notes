import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { isApprovedEmail } from "./lib/approved-emails";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "BullVeda <onboarding@resend.dev>",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return isApprovedEmail(user.email);
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
