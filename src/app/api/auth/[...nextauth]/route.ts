import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  // Configure session strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Add providers here
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Make a request to your authentication API
          const response = await fetch(`http://localhost:3000/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role || "user",
            subscriptionPlan: user.subscriptionPlan || "free",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },

  // Callbacks for customizing session, JWT, etc.
  callbacks: {
    async jwt({ token, user }) {
      // Add custom user data to the JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.subscriptionPlan = user.subscriptionPlan;
      }
      return token;
    },

    async session({ session, token }) {
      // Add custom token data to the session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role as string;
        session.user.subscriptionPlan = token.subscriptionPlan as string;
      }
      return session;
    },
  },

  // Enable debug messages during development
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
