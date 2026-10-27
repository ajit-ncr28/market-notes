import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { isApprovedEmail } from "./lib/approved-emails";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Resend({
      from: "BullVeda <onboarding@resend.dev>", // Update this after Resend setup
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow approved emails
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
});
