import { useState, useEffect } from "react";
import { useUserPlan } from "./useUserPlan";
import { FeatureGuard, WholesalerUsage } from "../featureGuard";
import { getWholesalerUsage } from "../../app/actions/supabase";
import { useSession } from "next-auth/react";

export function useFeatureGuard() {
  const { data: session } = useSession();
  const { userPlan, loading: planLoading, hasAccess, planName } = useUserPlan();
  const [usage, setUsage] = useState<WholesalerUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsage = async () => {
      if (planLoading || !session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Direct Supabase call instead of API route
        const usageData = await getWholesalerUsage();
        setUsage({
          buyer_count: usageData.buyer_count || 0,
          tag_count: usageData.tag_count || 0,
          email_count: usageData.email_count || 0,
          current_plan: usageData.current_plan || "Free",
        });
      } catch (err) {
        console.error("Error fetching usage:", err);
        // If user doesn't exist in usage table or other error, provide default usage
        setUsage({
          buyer_count: 0,
          tag_count: 0,
          email_count: 0,
          current_plan: "Free",
        });
        // Only set error for non-PGRST116 errors (which are now handled gracefully)
        if (err instanceof Error && !err.message.includes("PGRST116")) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [userPlan, planLoading, session]);

  const featureGuard = usage
    ? new FeatureGuard({
        planName: (planName as any) || "Free",
        usage,
        hasAccess: hasAccess,
      })
    : null;

  const refetch = async () => {
    if (session?.user?.id) {
      try {
        setLoading(true);
        setError(null);

        // Direct Supabase call for refetch
        const usageData = await getWholesalerUsage();

        setUsage({
          buyer_count: usageData.buyer_count || 0,
          tag_count: usageData.tag_count || 0,
          email_count: usageData.email_count || 0,
          current_plan: usageData.current_plan || "Free",
        });
      } catch (err) {
        console.error("Error refetching usage:", err);
        // If user doesn't exist in usage table or other error, provide default usage
        setUsage({
          buyer_count: 0,
          tag_count: 0,
          email_count: 0,
          current_plan: "Free",
        });
        // Only set error for non-PGRST116 errors (which are now handled gracefully)
        if (err instanceof Error && !err.message.includes("PGRST116")) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    featureGuard,
    usage,
    loading: planLoading || loading,
    error,
    refetch,
  };
}
