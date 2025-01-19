import NextAuth, { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenant: { label: "Tenant", type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.tenant
        ) {
          throw new Error("Missing credentials");
        }

        const tenant = await prisma.tenant.findUnique({
          where: { domain: credentials.tenant },
        });

        if (!tenant) {
          throw new Error("Tenant not found");
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
          include: {
            tenants: {
              where: { tenantId: tenant.id },
            },
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        const tenantUser = user.tenants[0];

        if (!tenantUser) {
          throw new Error("User not associated with this tenant");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tenant: tenant.id,
          role: tenantUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | undefined }) {
      if (user) {
        token.tenant = user.tenant;
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.tenant = token.tenant;
      session.role = token.role;
      session.userId = token.userId;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
