import NextAuth, {
  Awaitable,
  NextAuthOptions,
  RequestInternal,
  User,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      type: "credentials",
      credentials: {},
      authorize: function (
        credentials: Record<never, string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Awaitable<User | null> {
        const { username, role, id, accessToken, image }: any = credentials;
        return {
          id: id,
          role: role,
          username: username,
          accessToken: accessToken,
          image: image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username as string;
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
