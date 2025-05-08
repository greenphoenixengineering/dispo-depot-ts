import BuyersTable from '@/components/BuyersTable'
import React from 'react'
import { getBuyersWithTags } from '../actions/action'

const Dashboard = async () => {


  const buyersWithTags=await getBuyersWithTags()


  return (
    <div>
      <BuyersTable wholesaleBuyersWithTags={buyersWithTags || []} />
    </div>
  )
}

export default Dashboard