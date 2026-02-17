import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const usersApiBaseUrl =
  process.env.NEXT_PUBLIC_USERS_API_URL ?? "http://localhost:3002";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${usersApiBaseUrl}/auth`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });

          const data = await res.json();

          if (res.ok && data?.access_token && data?.user?.id) {
            const firstName = data.user.firstName ?? data.user.first_name ?? "";
            return {
              id: data.user.id,
              name: firstName,
              email: data.user.email,
              accessToken: data.access_token,
            };
          }
          return null;
        } catch {
          return null;
        }
      }
    })
  ],
  callbacks: {
    // attach the custom accessToken to the encrypted JWT cookie (api token !== auth session token)
    async jwt({ token, user }) {
      const nextToken = token as typeof token & { accessToken?: string };

      if (user && "accessToken" in user && typeof user.accessToken === "string") {
        nextToken.accessToken = user.accessToken;
      }
      return nextToken;
    },
    // expose the accessToken to the frontend session to use in useSession hook (api token !== auth session token)
    async session({ session, token }) {
      const nextSession = session as typeof session & { accessToken?: string };

      if (typeof token.accessToken === "string") {
        nextSession.accessToken = token.accessToken;
      }

      return nextSession;
    }
  },
  pages: {
    signIn: '/login', // Redirect here if auth fails
  },
});
