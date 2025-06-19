import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import config from "@/config";

import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createUserAlias, notifyAdminNewAliasCreated, updateUserAliasOnSupa } from "@/app/actions/action";

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
          last_name: profile.family_name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  events: {
    createUser: async function ({ user }) {
      try {
        console.log(`Starting alias creation process for user: ${user.id}`);

        // Step 1: Create the alias on the external service
        const data = await createUserAlias({
          alias: `reply-${user.id}`,
          forward: `${user.email}`,
        });

        if (data && data.alias) {
          console.log(`Alias created on ImprovMX: ${data.alias.alias}`);

          // Step 2: Store the alias in your Supabase database
          const updateData = await updateUserAliasOnSupa({
            alias: data.alias.alias,
            userId: user.id,
          });

          // Improvement: Check if the update was actually successful
          if (updateData.success) {
            await notifyAdminNewAliasCreated()
            console.log("✅ Successfully stored alias in Supabase:");
          } else {
            console.error(
              "🚨 CRITICAL: Failed to store alias in Supabase. An alias exists on ImprovMX but not in our DB."
            );
          }
        } else {
          console.error(
            "Failed to create alias on ImprovMX. The response was:",
            data
          );
        }
      } catch (e) {
        console.error(
          "An unexpected exception occurred in the createUser process:",
          e
        );
      }
    },
  },
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    secret: process.env.SUPABASE_SERVICE_ROLE ?? "",
  }),

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
