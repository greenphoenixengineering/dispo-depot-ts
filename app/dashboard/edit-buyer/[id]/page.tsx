import { getSingleBuyer, getWholesalerTags } from "@/app/actions/supabase";
import EditBuyerForm from "@/components/EditBuyerForm";

export default async function EditBuyerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wholesalerTags = await getWholesalerTags();
  const currentBuyer = await getSingleBuyer(id);

  return (
    <EditBuyerForm buyer={currentBuyer[0]} availableTags={wholesalerTags} />
  );
}
