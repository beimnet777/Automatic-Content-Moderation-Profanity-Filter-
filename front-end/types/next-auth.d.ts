import { DefaultUser } from "next-auth";
declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      role: string;
      username: string;
      accessToken: string;
      image: string;
    };
  }
  interface User extends DefaultUser {
    role: string;
    username: string;
    accessToken: string;
    image: string;
  }
}
