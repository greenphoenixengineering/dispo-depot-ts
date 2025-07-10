import { createClient } from '@supabase/supabase-js'
// supabase service functions

// Client for browser usage (public)
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
)

// Service client for server-side operations (private)
export const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
)

// Types for user data
export interface SupabaseUser {
  id: string;
  email: string;
  name?: string;
  stripe_customer_id?: string;
  stripe_price_id?: string;
  plan_name?: string;
  has_access: boolean;
  wholesaler_id?: string;
  created_at: string;
  updated_at: string;
}

// Functions to manage user data in Supabase
export const supabaseUserService = {
  // Create or update user
  async upsertUser(userData: {
    email: string;
    name?: string;
    stripe_customer_id?: string;
    stripe_price_id?: string;
    plan_name?: string;
    has_access?: boolean;
    wholesaler_id?: string;
  }) {
    const { data, error } = await supabaseService
      .from('wholesaler_subscriptions')
      .upsert({
        email: userData.email,
        name: userData.name,
        stripe_customer_id: userData.stripe_customer_id,
        stripe_price_id: userData.stripe_price_id,
        plan_name: userData.plan_name,
        has_access: userData.has_access ?? false,
        wholesaler_id: userData.wholesaler_id, // Store wholesaler_id
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      throw error;
    }

    return data;
  },

  // Get user by email
  async getUserByEmail(email: string) {
    const { data, error } = await supabaseService
      .from('user_subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Supabase get user error:', error);
      throw error;
    }

    return data;
  },

  // Get user by Stripe customer ID
  async getUserByStripeCustomerId(customerId: string) {
    const { data, error } = await supabaseService
      .from('user_subscriptions')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase get user error:', error);
      throw error;
    }

    return data;
  },

  // Update user access
  async updateUserAccess(email: string, hasAccess: boolean) {
    const { data, error } = await supabaseService
      .from('user_subscriptions')
      .update({ 
        has_access: hasAccess,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single();

    if (error) {
      console.error('Supabase update access error:', error);
      throw error;
    }

    return data;
  }
};