import { plans } from "./AvailablePlans";
import { PLAN_LIMITS, formatLimit, getUsagePercentage } from "@/libs/planLimits";
import { PlanName } from "@/types/config"; 

interface WholesalerUsageProps {
  id: number;
  created_at: string;
  wholesaler_id: number;
  subscription_id: string;
  current_plan: string;
  buyer_count: number;
  tag_count: number;
  email_count: number;
}

interface CurrentPlanCardProps {
  wholesalerUsage: WholesalerUsageProps;
}

// Remove the old PLAN_LIMITS as we're importing it from planLimits.ts

const CurrentPlanCard = ({ wholesalerUsage }: CurrentPlanCardProps) => {
  // Find the full plan information (name, description, price, etc.)
  const currentPlanInfo = plans.find(
    (plan) => plan.name.toLowerCase() === wholesalerUsage.current_plan?.toLowerCase()
  );

  // Get the specific limits for the current plan using the new system
  const planName = wholesalerUsage.current_plan as PlanName || PlanName.FREE;
  const limits = PLAN_LIMITS[planName] || PLAN_LIMITS[PlanName.FREE];
  
  const buyerPercentage = getUsagePercentage(wholesalerUsage.buyer_count, limits.buyers);
  const emailPercentage = getUsagePercentage(wholesalerUsage.email_count, limits.emailsPerTagPerMonth);
  const tagPercentage = getUsagePercentage(wholesalerUsage.tag_count, limits.tags);

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
                {wholesalerUsage.buyer_count} / {formatLimit(limits.buyers)}
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
                {wholesalerUsage.email_count} / {formatLimit(limits.emailsPerTagPerMonth)}
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
                {wholesalerUsage.tag_count} / {formatLimit(limits.tags)}
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