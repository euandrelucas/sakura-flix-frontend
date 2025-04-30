import { DefaultSession, DefaultUser } from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      subscriptionPlan?: string;
    } & DefaultSession["user"];
  }

  // Extend the built-in user types
  interface User extends DefaultUser {
    id: string;
    role?: string;
    subscriptionPlan?: string;
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    subscriptionPlan?: string;
  }
}
