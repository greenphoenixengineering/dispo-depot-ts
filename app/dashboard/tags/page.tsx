import { getTagsWithCounts } from '@/app/actions/action'
import TagWithBuyerTable from '@/components/TagWithBuyerTable'
import React from 'react'

const ManageTagPage =async () => {
  const tags=await getTagsWithCounts()
  return (
    <TagWithBuyerTable tagsList={tags} />
  )
}

export default ManageTagPage