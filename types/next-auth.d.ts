import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    tenant?: string;
    role?: string;
    userId?: string;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    tenant?: string;
    role?: string;
    userId?: string;
  }

  interface User {
    tenant?: string;
    role?: string;
    id: string;
  }
}
