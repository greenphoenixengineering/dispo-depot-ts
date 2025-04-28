"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Plus, X, Check } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { TagChip } from "@/components/tag-ship"

// Mock data for tags
const mockTags = [
  { id: 1, name: "Retail", color: "green", buyerCount: 42 },
  { id: 2, name: "VIP", color: "purple", buyerCount: 15 },
  { id: 3, name: "New", color: "blue", buyerCount: 23 },
  { id: 4, name: "Wholesale", color: "yellow", buyerCount: 18 },
  { id: 5, name: "Inactive", color: "red", buyerCount: 7 },
]

export default function ManageTagsPage() {
  const [tags, setTags] = useState(mockTags)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  // No longer need newTagColor state since it will be randomly selected
  const [isCreating, setIsCreating] = useState(false)
  const [createMessage, setCreateMessage] = useState("")

  // Delete tag state
  const [deletingTag, setDeletingTag] = useState<{ id: number; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Available colors for random selection
    const colors = ["green", "blue", "purple", "yellow", "red"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    // In a real app, you would send the data to your API
    const newTag = {
      id: Math.max(...tags.map((tag) => tag.id)) + 1,
      name: newTagName,
      color: randomColor,
      buyerCount: 0,
    }

    setTags([...tags, newTag])
    console.log("Tag created:", newTag)

    setIsCreating(false)
    setCreateMessage("Tag created successfully!")
    setNewTagName("")

    // Hide form after successful creation
    setTimeout(() => {
      setShowCreateForm(false)
      setCreateMessage("")
    }, 2000)
  }

  const cancelCreate = () => {
    setShowCreateForm(false)
    setNewTagName("")
    setCreateMessage("")
  }

  const startDeleteTag = (tag: (typeof tags)[0]) => {
    setDeletingTag({
      id: tag.id,
      name: tag.name,
    })
  }

  const confirmDeleteTag = async () => {
    if (!deletingTag) return

    setIsDeleting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Remove the tag from the local state
    const updatedTags = tags.filter((tag) => tag.id !== deletingTag.id)
    setTags(updatedTags)

    console.log("Tag deleted:", deletingTag)

    setIsDeleting(false)
    setDeletingTag(null)
  }

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
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tag</span>
          </button>
        </div>
      </div>

      {/* Tag Creation Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Create New Tag</h2>
            <button onClick={cancelCreate} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {createMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-md flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{createMessage}</span>
            </div>
          )}

          <form onSubmit={handleCreateTag}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Name *
                </label>
                <input
                  type="text"
                  id="tagName"
                  required
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter tag name"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelCreate}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Tag</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

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
            {tags.map((tag,index) => (
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
                  <Link href={`/dashboard/tags/edit/${tag.id}`} className="text-green-600 hover:text-green-900 mr-3">
                    Edit
                  </Link>
                  <button onClick={() => startDeleteTag(tag)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deletingTag !== null}
        title="Delete Tag"
        description="Are you sure you want to delete the tag"
        itemName={deletingTag?.name || ""}
        isDeleting={isDeleting}
        onConfirm={confirmDeleteTag}
        onCancel={() => setDeletingTag(null)}
      />
    </div>
  )
}
