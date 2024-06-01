import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/drizzle";

export const authOptions: any = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      // profile(profile): any {
      //   console.log(profile, "profile");
      //   return { ...profile, id: profile.sub };
      // },
    }),
  ],
};

export const getAuthSession = () => getServerSession(authOptions);
