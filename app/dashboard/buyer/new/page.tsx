import { getWholesalerTags } from '@/app/actions/action'
import AddBuyerForm from '@/components/AddBuyerForm'
import React from 'react'

const NewBuyerPage = async () => {
  const WholesaleerTags=await getWholesalerTags()

  console.log('wholesaler tags',WholesaleerTags)
  return (
    <div>
      <AddBuyerForm tags={WholesaleerTags} />
    </div>
  )
}

export default NewBuyerPage