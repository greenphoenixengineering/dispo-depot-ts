"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { TagChip } from "@/components/tag-ship";
import { Buyer } from "@/libs/types";

export default function BuyersCardList({ buyersWithTags }: { buyersWithTags: Buyer[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const buyersPerPage = 10;
  const totalPages = Math.ceil((buyersWithTags?.length || 0) / buyersPerPage);

  const currentBuyers = buyersWithTags?.slice(
    (currentPage - 1) * buyersPerPage,
    currentPage * buyersPerPage
  );

  return (
    <div>
      <div className="space-y-4">
        {currentBuyers?.map((buyer) => (
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
      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 