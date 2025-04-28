import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react"
import { TagChip } from "@/components/tag-ship"
import { getTagsWithCounts } from "@/app/actions/action"

// Mock data for tags
const mockTags = [
  { id: 1, name: "Retail", color: "green", buyerCount: 42 },
  { id: 2, name: "VIP", color: "purple", buyerCount: 15 },
  { id: 3, name: "New", color: "blue", buyerCount: 23 },
  { id: 4, name: "Wholesale", color: "yellow", buyerCount: 18 },
  { id: 5, name: "Inactive", color: "red", buyerCount: 7 },
]

export default async function ManageTagsPage() {
  const tags=await getTagsWithCounts()

  console.log("all tags",tags)
  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manage Tags</h1>
            <p className="text-gray-600">Create and manage tags to organize your buyers</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tag</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tag
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Color
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Buyers
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
            {mockTags.map((tag,index) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <TagChip label={tag.name} index={index} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 capitalize">{tag.color}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{tag.buyerCount} buyers</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-600 hover:text-gray-900 mr-3">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
