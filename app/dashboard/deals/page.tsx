import { getWholesalerTags } from "@/app/actions/supabase";
import SendDealForm from "@/components/SendDealForm";
import {  ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = async () => {
  const tags = await getWholesalerTags();


  return (
    <>
      <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Send Deals to Tags</h1>
        <p className="text-sm sm:text-base text-gray-600">Create and send targeted deals to specific buyer segments</p>
      </div>
      <SendDealForm tags={tags} />
    </>
  );
};

export default page;
