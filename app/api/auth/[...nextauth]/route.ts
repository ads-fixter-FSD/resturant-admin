/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { loginUserApi } from "../../../modules/auth/auth.api";

// Token এর expiry টাইম বের করার ফাংশন
const getTokenExpiryMs = (accessToken: string) => {
  try {
    const payloadBase64 = accessToken.split(".")[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
    return payload?.exp ? payload.exp * 1000 : Date.now() + 60 * 1000;
  } catch {
    return Date.now() + 60 * 1000;
  }
};

const refreshAccessToken = async (token: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      { refreshToken: token.refreshToken },
      { withCredentials: true },
    );

    const newAccessToken = response?.data?.data?.token;
    const refreshedUser = response?.data?.data?.user;

    if (!newAccessToken) {
      return { ...token, error: "RefreshAccessTokenError" };
    }


    if (token.role !== refreshedUser?.role) {
      return { ...token, error: "RoleChanged" };
    }

    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: getTokenExpiryMs(newAccessToken),
      name: refreshedUser?.name || token.name,
      picture: refreshedUser?.image || token.picture,
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

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

          if (!res.success || !res.data.user) {
            throw new Error("Invalid email or password");
          }

          const user = res.data.user;

          // 🔥 ✅ STRICT ADMIN CHECK
          if (user.role !== "admin") {
            throw new Error("Unauthorized! Only admins can access this panel.");
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            phone: user.phone,
            accessToken: res.data.token,
            refreshToken: res.data.refreshToken,
            accessTokenExpires: getTokenExpiryMs(res.data.token),
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
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = (user as any).accessTokenExpires;
        token.name = (user as any).name;
        token.picture = (user as any).image;
        token.email = (user as any).email;
        token.phone = (user as any).phone;
      }

      // ক্লায়েন্ট থেকে সেশন আপডেট করলে (Trigger Update)
      if (trigger === "update" && session?.user) {
        return { ...token, ...session.user };
      }

      // টোকেন যদি এখনো ভ্যালিড থাকে, তবে পুরনো টোকেনই রিটার্ন করবে
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // টোকেন এক্সপায়ার হয়ে গেলে রিফ্রেশ করার চেষ্টা করবে
      return refreshAccessToken(token);
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
        session.error = token.error; // সেশনে এরর পাঠালে ক্লায়েন্ট লগআউট করতে পারবে
      }
      return session;
    },
  },

  pages: {
    signIn: "/", // অ্যাডমিন লগইন পেজ
    error: "/", // এরর হলে যেখানে পাঠাবে
  },

  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // ১ দিন সেশন থাকবে
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
