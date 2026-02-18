import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function getAppBaseUrl(): string {
  return process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

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
          const res = await fetch(`${getAppBaseUrl()}/api/users/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          });

          const data = await res.json();

          const accessToken = data?.accessToken ?? data?.access_token;
          if (res.ok && accessToken && data?.user?.id) {
            const firstName = data.user.firstName ?? data.user.first_name ?? "";
            return {
              id: data.user.id,
              name: firstName,
              email: data.user.email,
              accessToken,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // attach the custom accessToken to the encrypted JWT cookie (api token !== auth session token)
    async jwt({ token, user }) {
      if (user && "accessToken" in user && typeof user.accessToken === "string") {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // expose the accessToken to the frontend session to use in useSession hook (api token !== auth session token)
    async session({ session, token }) {
      if (session.user && typeof token.sub === "string") {
        session.user.id = token.sub;
      }

      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }

      return session;
    }
  },
  pages: {
    signIn: "/login", // Redirect here if auth fails
  },
});
