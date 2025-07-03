import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import config from "@/config";

import { SupabaseAdapter } from "@auth/supabase-adapter";
import { updateUserAliasOnSupa } from "@/app/actions/supabase";
import {
  createUserAlias,
  notifyAdminNewAliasCreated,
} from "@/app/actions/improveMx";

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
        // Step 1: Create the alias on the external service
        const data = await createUserAlias({
          alias: `reply-${user.id}`,
          forward: `${user.email}`,
        });

        if (data && data.alias) {
          // Step 2: Store the alias in your Supabase database
          const updateData = await updateUserAliasOnSupa({
            alias: `reply-${user.id}@mydispodepot.io`,
            userId: user.id,
          });

          // I Check if the update was actually successful
          if (updateData.success) {
            // notify the admin with the new user alias
            const sendEmailResult = await notifyAdminNewAliasCreated({
              userName: user.first_name + user.last_name,
              userAlias: `reply-${user.id}@mydispodepot.io`,
            });

            console.log("send email result",sendEmailResult)
            if (sendEmailResult.success) {
              console.log("email sent to admin successfully");
            } else {
              console.log(
                "there was an error notifying the admin about the new user alias"
              );
            }
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
