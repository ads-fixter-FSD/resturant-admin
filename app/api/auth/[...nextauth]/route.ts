/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUserApi } from "../../../modules/auth/auth.api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await loginUserApi({
            email: credentials?.email as string,
            password: credentials?.password as string,
          });

          // ❌ যদি login fail
          if (!res.success || !res.data.user) {
            throw new Error("Invalid credentials");
          }

          const user = res.data.user;

          // 🔥 ✅ ONLY ADMIN ALLOWED
          if (user.role !== "admin") {
            throw new Error("Only admin can login");
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            phone: user.phone,
            accessToken: res.data.token,
          };
        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || error.message || "Login failed",
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 🔥 first login
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.name = (user as any).name;
        token.picture = (user as any).image;
        token.email = (user as any).email;
        token.phone = (user as any).phone;
      }

      // 🔄 update session
      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.image) token.picture = session.user.image;
        if (session.user.phone) token.phone = session.user.phone;
      }

      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user = {
          id: token.id,
          role: token.role,
          email: token.email,
          name: token.name,
          image: token.picture,
          phone: token.phone,
        };

        session.accessToken = token.accessToken;
      }

      return session;
    },
  },

  pages: {
    signIn: "/",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
