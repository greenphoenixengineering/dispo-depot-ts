import { getCurrentWholesaler, getWholesalerTags } from "@/app/actions/action";
import SendDealForm from "@/components/SendDealForm";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = async () => {
  const tags = await getWholesalerTags();
  const currentWholesaler = await getCurrentWholesaler();

  console.log("current wholesaler", currentWholesaler);

  return (
    <>
      <div className="mb-6">
        {/* Authorization Banner */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Send Deals to Tags</h1>
        <p className="text-gray-600">
          Create and send targeted deals to specific buyer segments
        </p>
      </div>
      <SendDealForm tags={tags} />
    </>
  );
};

export default page;
