import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabaseUserService } from '../supabase';

export interface UserPlan {
  email: string;
  name?: string;
  plan_name?: string;
  has_access: boolean;
  stripe_customer_id?: string;
  stripe_price_id?: string;
  created_at: string;
  updated_at: string;
}
//Create React Hook to Access User Plan Data
export function useUserPlan() {
  const { data: session, status } = useSession();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (status === 'loading') return;
      
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Direct Supabase call instead of API route
        const userPlan = await supabaseUserService.getUserByEmail(session.user.email);
        
        if (userPlan) {
          setUserPlan({
            email: userPlan.email,
            name: userPlan.name,
            plan_name: userPlan.plan_name,
            has_access: userPlan.has_access,
            stripe_customer_id: userPlan.stripe_customer_id,
            stripe_price_id: userPlan.stripe_price_id,
            created_at: userPlan.created_at,
            updated_at: userPlan.updated_at,
          });
        } else {
          // User plan not found - this is normal for new users
          setUserPlan(null);
        }
      } catch (err) {
        console.error('Error fetching user plan:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [session, status]);

  const refetch = async () => {
    if (session?.user?.email) {
      setLoading(true);
      try {
        // Direct Supabase call for refetch
        const userPlan = await supabaseUserService.getUserByEmail(session.user.email);
        
        if (userPlan) {
          setUserPlan({
            email: userPlan.email,
            name: userPlan.name,
            plan_name: userPlan.plan_name,
            has_access: userPlan.has_access,
            stripe_customer_id: userPlan.stripe_customer_id,
            stripe_price_id: userPlan.stripe_price_id,
            created_at: userPlan.created_at,
            updated_at: userPlan.updated_at,
          });
        } else {
          setUserPlan(null);
        }
      } catch (err) {
        console.error('Error refetching user plan:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    userPlan,
    loading,
    error,
    refetch,
    isAuthenticated: !!session?.user,
    hasAccess: userPlan?.has_access ?? false,
    planName: userPlan?.plan_name,
  };
} 