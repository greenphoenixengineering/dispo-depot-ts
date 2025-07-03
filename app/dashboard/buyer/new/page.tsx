import { getWholesalerTags } from "@/app/actions/supabase";
import AddBuyerForm from "@/components/AddBuyerForm";
import React from "react";

const NewBuyerPage = async () => {
  const WholesalerTags = await getWholesalerTags();

  return <AddBuyerForm tags={WholesalerTags} />;
};

export default NewBuyerPage;
