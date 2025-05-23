import BuyersTable from '@/components/BuyersTable'
import React from 'react'
import { getBuyersWithTags } from '../actions/action'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import { TagChip } from '@/components/tag-ship'
import { Buyer } from '@/libs/types'

const Dashboard = async () => {
  const buyersWithTags = await getBuyersWithTags()

  return (
    <div>
      {/* Mobile card layout */}
      <div className="space-y-4 sm:hidden">
        {buyersWithTags?.map((buyer) => (
          <div key={buyer.id} className="p-4 border rounded shadow bg-white">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">
                {buyer.first_name} {buyer.last_name}
              </h3>
              <Link
                href={`/dashboard/edit-buyer/${buyer.id}`}
                className="text-gray-600 hover:text-gray-900"
              >
                <Edit className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{buyer.email}</p>
              {buyer.phone_num && <p>{buyer.phone_num}</p>}
              {buyer.buyer_tags && buyer.buyer_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {buyer.buyer_tags.map((tagLink: { tags: { id: number; name: string } }, index: number) => (
                    <TagChip
                      key={tagLink.tags.id}
                      label={tagLink.tags.name}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout (hidden on small screens) */}
      <div className="hidden sm:block">
        <BuyersTable wholesaleBuyersWithTags={buyersWithTags || []} />
      </div>
    </div>
  )
}

export default Dashboard