import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );

        const data = await res.json();
        if (!data?.token) {
          const register = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );
          const reg = await register.json();
          if (!reg?.token) {
            return null;
          }
          return {
            id: reg.user.id,
            email: reg.user.email,
            orgId: reg.user.orgId,
            accessToken: reg.token,
          };
        }
        return {
          id: data.user.id,
          email: data.user.email,
          orgId: data.user.orgId,
          accessToken: data.token,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          },
        );
        const data = await res.json();
        if (data?.token) {
          (user as any).accessToken = data.token;
          (user as any).orgId = data.user?.orgId;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.orgId = (user as any).orgId;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).orgId = token.orgId;
      (session as any).userId = token.userId;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
