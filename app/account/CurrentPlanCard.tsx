import { getWholesalerUsage } from "../actions/supabase";

const CurrentPlanCard = async () => (
   
   
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start sm:items-center mb-10">
    <div className="flex-1 min-w-[220px]">
      <div className="text-sm font-semibold text-gray-500 mb-1">
        Current Plan & Usage
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-block text-lg font-bold text-gray-900">
          ☆ Free Plan
        </span>
      </div>
      <div className="text-gray-500 text-sm mb-2">
        Perfect for getting started
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        $0<span className="text-base font-medium text-gray-500">/month</span>
      </div>
    </div>
    <div className="flex-1 w-full max-w-md">
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
            <span>Buyers</span>
            <span className="text-gray-800 font-semibold">8 / 10</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: "80%" }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
            <span>Emails This Month</span>
            <span className="text-gray-800 font-semibold">1 / 1</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
            <span>Tags Created</span>
            <span className="text-gray-800 font-semibold">3 / Unlimited</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-purple-500 rounded-full"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CurrentPlanCard;
