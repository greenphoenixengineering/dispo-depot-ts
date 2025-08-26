import { plans } from "./AvailablePlans"; 

interface WholesalerUsageProps {
  id: number;
  created_at: string;
  wholesaler_id: number;
  subscription_id: string;
  current_plan: 'free' | 'standard' | 'pro';
  buyer_count: number;
  tag_count: number;
  email_count: number;
}

interface CurrentPlanCardProps {
  wholesalerUsage: WholesalerUsageProps;
}

const PLAN_LIMITS = {
  free: {
    buyers: 10,
    emails: 1, 
    tags: 'Unlimited' as const
  },
  standard: {
    buyers: 500,
    emails: 5000,
    tags: 'Unlimited' as const,
  },
  pro: {
    buyers: 'Unlimited' as const,
    emails: 'Unlimited' as const,
    tags: 'Unlimited' as const,
  },
};

const CurrentPlanCard = ({ wholesalerUsage }: CurrentPlanCardProps) => {
  // Find the full plan information (name, description, price, etc.)
  const currentPlanInfo = plans.find(
    (plan) => plan.name.toLowerCase() === wholesalerUsage.current_plan
  );

  // Get the specific limits for the current plan
  const limits = PLAN_LIMITS[wholesalerUsage.current_plan];


  // Helper function to calculate percentage for progress bars
  const getPercentage = (count: number, limit: number | 'Unlimited') => {
    if (limit === 'Unlimited' || limit === 0) {
      // For unlimited, you can decide how to show it. 100% is a common choice.
      return 100;
    }
    // Calculate percentage, but don't let it go over 100%
    return Math.min((count / limit) * 100, 100);
  };
  
  const buyerPercentage = getPercentage(wholesalerUsage.buyer_count, limits.buyers);
  const emailPercentage = getPercentage(wholesalerUsage.email_count, limits.emails);
  const tagPercentage = getPercentage(wholesalerUsage.tag_count, limits.tags);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start sm:items-center mb-10">
      <div className="flex-1 min-w-[220px]">
        <div className="text-sm font-semibold text-gray-500 mb-1">
          Current Plan & Usage
        </div>
        <div className="flex items-center gap-2 mb-1 text-lg text-gray-900">
          {currentPlanInfo.icon} 
          <span className="font-bold">{currentPlanInfo.name} Plan</span>
        </div>
        <div className="text-gray-500 text-sm mb-2">
          {currentPlanInfo.description}
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          ${currentPlanInfo.price}
          <span className="text-base font-medium text-gray-500">/month</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
              <span>Buyers</span>
              <span className="text-gray-800 font-semibold">
                {wholesalerUsage.buyer_count} / {limits.buyers}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${buyerPercentage}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
              <span>Emails This Month</span>
              <span className="text-gray-800 font-semibold">
                {wholesalerUsage.email_count} / {limits.emails}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${emailPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
              <span>Tags Created</span>
              <span className="text-gray-800 font-semibold">
                {wholesalerUsage.tag_count} / {limits.tags}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${tagPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlanCard;