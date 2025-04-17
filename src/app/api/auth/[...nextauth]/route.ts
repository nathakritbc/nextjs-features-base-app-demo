import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const credentialsSchema = z.object({
          username: z.string().min(1),
          password: z.string().min(1),
        });

        try {
          const validatedCredentials = credentialsSchema.parse(credentials);

          console.log(
            "Authorize: trying to login with:",
            validatedCredentials.username
          );

          // ทดสอบการเชื่อมต่อตามตัวอย่าง
          const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: validatedCredentials.username,
              password: validatedCredentials.password,
              expiresInMins: 30, // optional
            }),
            credentials: "include", // รวม cookies ในการเรียก API
          });

          if (!response.ok) {
            console.error(
              "DummyJSON login failed:",
              response.status,
              response.statusText
            );
            return null;
          }

          const user = await response.json();
          console.log("Login API response:", user);

          if (user) {
            return {
              id: user.id.toString(),
              name: user.username || user.firstName,
              email: user.email,
              image: user.image,
              token: user.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Authentication error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
          });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.token = token.token as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  debug: true, // เปิด debug mode ตลอดเวลา
  secret: process.env.NEXTAUTH_SECRET || "yoursecretkeyhere12345678901234",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
