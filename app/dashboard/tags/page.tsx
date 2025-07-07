import { getTagsWithCounts } from "@/app/actions/supabase";
import TagWithBuyerTable from "@/components/TagWithBuyerTable";
import { TagWithBuyerCount } from "@/libs/tagTypes";
import React from "react";

export const dynamic = "force-dynamic";
const ManageTagPage = async () => {
  const tags: TagWithBuyerCount[] = await getTagsWithCounts();

  return <TagWithBuyerTable tagsList={tags} />;
};

export default ManageTagPage;
