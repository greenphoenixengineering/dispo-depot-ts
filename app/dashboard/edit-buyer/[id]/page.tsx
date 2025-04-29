import { getSingleBuyer, getWholesalerTags } from "@/app/actions/action"
import EditBuyerForm from "@/components/EditBuyerForm"

export default async function EditBuyerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
    const WholesaleerTags=await getWholesalerTags()
    const currentBuyer=await getSingleBuyer(id)

    console.log("current buyer",currentBuyer)
  
  return <div>
    <EditBuyerForm buyer={currentBuyer[0]} availableTags={WholesaleerTags} />
  </div>
}