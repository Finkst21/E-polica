import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      if (!isAdminRoute) {
        return true;
      }

      return auth?.user?.role === "ADMIN";
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as "USER" | "ADMIN" | undefined;
      }

      return session;
    }
  },
  providers: []
} satisfies NextAuthConfig;

export default authConfig;
