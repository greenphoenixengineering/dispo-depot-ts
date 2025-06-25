import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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

        const response = await fetch('/api/user/plan');
        
        if (!response.ok) {
          if (response.status === 404) {
            // User plan not found - this is normal for new users
            setUserPlan(null);
          } else {
            throw new Error('Failed to fetch user plan');
          }
        } else {
          const data = await response.json();
          setUserPlan(data.data);
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
        const response = await fetch('/api/user/plan');
        if (response.ok) {
          const data = await response.json();
          setUserPlan(data.data);
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