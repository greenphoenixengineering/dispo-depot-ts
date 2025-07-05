import { getTagsWithCounts, getWholesalerTags } from "@/app/actions/supabase";
import SendDealForm from "@/components/SendDealForm";
import { TagWithBuyerCount } from "@/libs/tagTypes";

import React from "react";

const page = async () => {
  const tags = await getWholesalerTags();
  const tagsWithBuyerCount:TagWithBuyerCount[] = await getTagsWithCounts();


  const tagsThatHasBuyers=tagsWithBuyerCount?.filter(item=> item.buyer_count > 0)

  console.log("tags with buyer count", tagsWithBuyerCount);
  console.log("tags that has buyer", tagsThatHasBuyers);


  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Send Deals to Tags
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Create and send targeted deals to specific buyer segments
        </p>
      </div>
      <SendDealForm tags={tagsThatHasBuyers} />
    </>
  );
};

export default page;
