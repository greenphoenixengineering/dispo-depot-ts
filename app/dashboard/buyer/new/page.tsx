import { getWholesalerTags } from "@/app/actions/action";
import AddBuyerForm from "@/components/AddBuyerForm";
import React from "react";

const NewBuyerPage = async () => {
  const WholesalerTags = await getWholesalerTags();

  return <AddBuyerForm tags={WholesalerTags} />;
};

export default NewBuyerPage;
