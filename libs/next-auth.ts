import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import config from "@/config";

import { SupabaseAdapter } from "@auth/supabase-adapter";

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter: any;
}

export const authOptions: NextAuthOptionsExtended = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          first_name: profile.given_name ? profile.given_name : profile.name,
          last_name:profile.family_name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    // CredentialsProvider({
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //     mode: { label: "Mode", type: "text" }
    //   },
    //   async authorize(credentials) {
       
    //     console.log("user credentials",credentials)
    //     return null;
    //   }
    // }),
 
  ],

  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    secret: process.env.SUPABASE_SERVICE_ROLE ?? '',
  }) ,


  callbacks: {
  
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;

      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
};

export default NextAuth(authOptions);
