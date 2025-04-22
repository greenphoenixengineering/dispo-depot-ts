"use client"

import { useState } from "react"
import Link from "next/link"

import { Tag, Mail, Plus, Search } from "lucide-react"
import { TagChip } from "@/components/tag-ship"
import { Pagination } from "@/components/pagination"

// Mock data for buyers
const mockBuyers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    tags: [
      { id: 1, name: "Retail", color: "green" },
      { id: 2, name: "VIP", color: "purple" },
    ],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    tags: [
      { id: 1, name: "Retail", color: "green" },
      { id: 3, name: "New", color: "blue" },
    ],
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "(555) 456-7890",
    tags: [{ id: 4, name: "Wholesale", color: "yellow" }],
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 234-5678",
    tags: [
      { id: 1, name: "Retail", color: "green" },
      { id: 5, name: "Inactive", color: "red" },
    ],
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "(555) 876-5432",
    tags: [
      { id: 4, name: "Wholesale", color: "yellow" },
      { id: 2, name: "VIP", color: "purple" },
    ],
  },
  {
    id: 6,
    name: "Jessica Martinez",
    email: "jessica.m@example.com",
    phone: "(555) 345-6789",
    tags: [{ id: 3, name: "New", color: "blue" }],
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert.t@example.com",
    phone: "(555) 654-3210",
    tags: [{ id: 1, name: "Retail", color: "green" }],
  },
  {
    id: 8,
    name: "Jennifer Anderson",
    email: "jennifer.a@example.com",
    phone: "(555) 432-1098",
    tags: [
      { id: 4, name: "Wholesale", color: "yellow" },
      { id: 2, name: "VIP", color: "purple" },
    ],
  },
  {
    id: 9,
    name: "Christopher Thomas",
    email: "chris.t@example.com",
    phone: "(555) 210-9876",
    tags: [
      { id: 1, name: "Retail", color: "green" },
      { id: 3, name: "New", color: "blue" },
    ],
  },
  {
    id: 10,
    name: "Amanda White",
    email: "amanda.w@example.com",
    phone: "(555) 789-0123",
    tags: [{ id: 5, name: "Inactive", color: "red" }],
  },
]

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter buyers based on search term
  const filteredBuyers = mockBuyers.filter(
    (buyer) =>
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.phone.includes(searchTerm) ||
      buyer.tags.some((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Calculate total pages
  const totalPages = Math.ceil(filteredBuyers.length / 10)

  // Get current page of buyers
  const currentBuyers = filteredBuyers.slice((currentPage - 1) * 10, currentPage * 10)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your buyers and send targeted deals</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/dashboard/deals"
          className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>Send Deals to Tags</span>
        </Link>
        <Link
          href="/dashboard/tags"
          className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          <Tag className="w-4 h-4" />
          <span>Manage Tags</span>
        </Link>
        <Link
          href="/dashboard/edit-buyer/new"
          className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors ml-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Buyer</span>
        </Link>
      </div>

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
                    <div className="text-sm font-medium text-gray-900">{buyer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{buyer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{buyer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {buyer.tags.map((tag) => (
                        <TagChip key={tag.id} label={tag.name} color={tag.color} />
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
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  )
}
