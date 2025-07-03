"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, Search } from "lucide-react";
import { TagChip } from "@/components/tag-ship";
import { Buyer } from "@/libs/types";

export default function BuyersCardList({ buyersWithTags }: { buyersWithTags: Buyer[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const buyersPerPage = 10;

  // Filter buyers based on search term
  const filteredBuyers = buyersWithTags?.filter(
    (buyer) =>
      buyer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.phone_num?.includes(searchTerm) ||
      buyer.buyer_tags?.some((tag) =>
        tag?.tags.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalPages = Math.ceil((filteredBuyers?.length || 0) / buyersPerPage);

  const currentBuyers = filteredBuyers?.slice(
    (currentPage - 1) * buyersPerPage,
    currentPage * buyersPerPage
  );

  return (
    <div>
      {/* Search bar */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Search buyers by name, email, phone or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredBuyers?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No buyers found.</p>
          <p className="text-sm">Add one by clicking the Add Buyer button above.</p>
        </div>
      ) : (
        <>
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
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
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
        </>
      )}
    </div>
  );
} 