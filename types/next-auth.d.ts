import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      /** The user's plan information from Supabase */
      plan?: {
        name?: string;
        hasAccess: boolean;
        stripeCustomerId?: string;
        stripePriceId?: string;
      };
    } & DefaultSession['user'];
  }
}
