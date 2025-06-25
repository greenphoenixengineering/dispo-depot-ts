import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import config from "@/config";
import { supabaseUserService } from "@/libs/supabase";

// import { SupabaseAdapter } from "@auth/supabase-adapter";

// interface NextAuthOptionsExtended extends NextAuthOptions {
//   adapter: any;
// }

export const authOptions: NextAuthOptions = {
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

  ],

  // adapter: SupabaseAdapter({
  //   url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  //   secret: process.env.SUPABASE_SERVICE_ROLE ?? '',
  // }) ,

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;

        // Fetch user plan data from Supabase and include in session
        try {
          const userPlan = await supabaseUserService.getUserByEmail(session.user.email);
          if (userPlan) {
            session.user.plan = {
              name: userPlan.plan_name,
              hasAccess: userPlan.has_access,
              stripeCustomerId: userPlan.stripe_customer_id,
              stripePriceId: userPlan.stripe_price_id,
            };
          }
        } catch (error) {
          // User doesn't have plan data yet, which is fine
          console.log('No plan data found for user:', session.user.email);
        }
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
