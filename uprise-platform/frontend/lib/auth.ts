import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // @ts-ignore-next-line
    (await import("next-auth/providers/google")).default({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.googleId = profile.sub;

        // Call backend to create/get user and get JWT
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          const res = await fetch(`${baseUrl}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              google_id: profile.sub,
              email: (profile as { email?: string }).email,
              name: (profile as { name?: string }).name,
              avatar_url: (profile as { picture?: string }).picture,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            token.backendToken = data.token;
            token.userId = data.user?.id;
          }
        } catch {
          // Backend not running — continue anyway
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { backendToken?: string; userId?: string }).backendToken =
          token.backendToken as string;
        (session.user as { backendToken?: string; userId?: string }).userId =
          token.userId as string;
      }
      return session;
    },
  },
};
