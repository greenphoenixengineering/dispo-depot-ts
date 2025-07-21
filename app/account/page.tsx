import DashboardShell from "@/components/DashboardShell";
import CurrentPlanCard from "./CurrentPlanCard";
import AvailablePlans from "./AvailablePlans";
import AccountDetails from "./AccountDetails";
import { getWholesalerUsage } from "../actions/supabase";

export default async function AccountPage() {
  const usage = await getWholesalerUsage();
  



 
  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto w-full">
        {/* Title and subtitle */}
        <div className="mb-6 mt-2 sm:mt-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Account Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Manage your subscription and view usage
          </p>
        </div>

    <CurrentPlanCard wholesalerUsage={usage} />
        <AvailablePlans />
        <AccountDetails plan={usage.current_plan} />
      </div>
    </DashboardShell>
  );
}
