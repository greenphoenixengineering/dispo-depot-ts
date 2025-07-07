import 'next-auth'; // or your auth library

// Extend the built-in 'User' type
declare module 'next-auth' {
  /**
   * The User model from your database, extended with custom properties.
   */
  interface User {
    // Add the properties that are missing from the default type
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  /**
   * The Session object, also extended to include the custom user.
   */
  interface plan {
    name?: string;
    hasAccess: boolean;
    stripeCustomerId?: string;
    stripePriceId?: string;
  }
  interface Session {
    user: User & {
      plan?: plan;
    };
  }
}