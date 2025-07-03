"use client";

import {  useState } from "react";
import Link from "next/link";

import { Tag, Mail, Plus, Search } from "lucide-react";
import { TagChip } from "@/components/tag-ship";
import { Pagination } from "@/components/pagination";
import { Buyer } from "@/libs/types";




export default function BuyersTable({
  wholesaleBuyersWithTags,
}: {
  wholesaleBuyersWithTags: Buyer[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter buyers based on search term
  const filteredBuyers = wholesaleBuyersWithTags?.filter(
    (buyer) =>
      buyer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.phone_num?.includes(searchTerm) ||
      buyer.buyer_tags?.some((tag) =>
        tag?.tags.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredBuyers.length / 10);

  // Get current page of buyers
  const currentBuyers = filteredBuyers.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );



  return (
    <div>
      

      {/* Search and filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Search buyers by name, email, phone or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Buyers table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tags
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBuyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {buyer.first_name}  {buyer.last_name }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{buyer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {buyer.phone_num || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {buyer.buyer_tags.map(({ tags }, index: number) => (
                        <TagChip
                          key={tags.id}
                          label={tags.name}
                          index={index}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/edit-buyer/${buyer.id}`}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Edit
                    </Link>
                    {/* <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
