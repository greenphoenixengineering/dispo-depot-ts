import { getWholesalerTags } from "@/app/actions/action";
import AddBuyerForm from "@/components/AddBuyerForm";
import React from "react";

const NewBuyerPage = async () => {
  const WholesaleerTags = await getWholesalerTags();

  return <AddBuyerForm tags={WholesaleerTags} />;
};

export default NewBuyerPage;
