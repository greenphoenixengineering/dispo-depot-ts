import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getWholesalerTags } from "@/app/actions/action"

export default async function SendDealsPage() {
  const tags=await getWholesalerTags()

  console.log("tags",tags)
  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Send Deals to Tags</h1>
        <p className="text-gray-600">Create and send targeted deals to specific buyer segments</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500 mb-4">Select tags to target specific buyer groups:</p>

        <div className="flex flex-wrap gap-2 mb-6">
       {tags.map(({ name, id }) => {
  return (
    <div key={id} className="flex items-center">
      <input
        id={`tag-${id}`}
        type="checkbox"
        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
      />
      <label htmlFor={`tag-${id}`} className="ml-2 block text-sm text-gray-900">
        {name}
      </label>
    </div>
  );
})}

        </div>

        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject Line
          </label>
          <input
            type="text"
            id="subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter email subject line"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your message here..."
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition-colors"
          >
            Send Deal
          </button>
        </div>
      </div>
    </div>
  )
}
