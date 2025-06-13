import BuyersTable from '@/components/BuyersTable'
import React from 'react'
import { getBuyersWithTags } from '../actions/action'
import Link from 'next/link'
import { Edit, Mail, Plus, Tag } from 'lucide-react'
import { TagChip } from '@/components/tag-ship'
import { Buyer } from '@/libs/types'
import BuyersCardList from '@/components/BuyersCardList'

const Dashboard = async () => {
  const buyersWithTags = await getBuyersWithTags()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your buyers and send targeted deals
        </p>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col w-full gap-3 mb-4 sm:flex-row sm:w-auto sm:items-center">
        <Link
          href="/dashboard/buyer/new"
          className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base hover:bg-green-600 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Buyer</span>
        </Link>        
      </div>
      
      {/* Mobile card layout */}
      <div className="xl:hidden">
        <BuyersCardList buyersWithTags={buyersWithTags || []} />
      </div>

      {/* Desktop table layout (hidden on small screens) */}
      <div className="hidden xl:block">
        <BuyersTable wholesaleBuyersWithTags={buyersWithTags || []} />
      </div>
    </div>
  )
}

export default Dashboard