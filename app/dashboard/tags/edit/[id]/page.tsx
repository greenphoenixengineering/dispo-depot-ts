"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { getSingleTag } from "@/app/actions/action"

// Mock data for tags (same as in tags/page.tsx)
const mockTags = [
  { id: 1, name: "Retail", color: "green", buyerCount: 42 },
  { id: 2, name: "VIP", color: "purple", buyerCount: 15 },
  { id: 3, name: "New", color: "blue", buyerCount: 23 },
  { id: 4, name: "Wholesale", color: "yellow", buyerCount: 18 },
  { id: 5, name: "Inactive", color: "red", buyerCount: 7 },
]

interface Props {
  params: { id: string }
}

export default function EditTagPage({ params }: Props) {
  const tagId = Number.parseInt(params.id)
  const [isLoading, setIsLoading] = useState(true)
  const [tagName, setTagName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
useEffect(() => {
  // Define an async function inside useEffect
  const fetchTagData = async () => {
    // 1. Handle cases where tagId might not be valid yet
    if (tagId === null || typeof tagId === 'undefined') {
      setIsLoading(false); // Stop loading if no ID
      setTagName(''); // Optionally reset tag name
      return;
    }

    setIsLoading(true); // Set loading true before the fetch

    try {
      const tagsArray = await getSingleTag(tagId); 
      if (tagsArray && tagsArray.length > 0) {
        const singleTag = tagsArray[0]; 
        setTagName(singleTag.name);
      } else {
        console.warn(`Tag with ID ${tagId} not found or getSingleTag returned no data.`);
        setTagName(''); 
      }
    } catch (error) {
      console.error("Error fetching single tag:", error);
      setTagName(''); 
    } finally {
      setIsLoading(false);
    }
  };

  fetchTagData(); // Call the async function

  
  // };
}, [tagId]); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would send the data to your API
    console.log("Tag updated:", { id: tagId, name: tagName })

    setIsSaving(false)
    setSaveMessage("Tag updated successfully!")

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage("")
    }, 3000)
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would send a delete request to your API
    console.log("Tag deleted:", tagId)

    setIsDeleting(false)
    setShowDeleteModal(false)

    // Redirect to tags page
    window.location.href = "/dashboard/tags"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/tags" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tags</span>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Edit Tag</h1>
        <p className="text-gray-600">Update tag information</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tag Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Tag Name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
              <p className="mt-2 text-sm text-gray-500"> buyers are currently using this tag</p>
            </div>
          </div>

          {saveMessage && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-md">{saveMessage}</div>}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
            >
              Delete Tag
            </button>

            <div className="flex gap-3">
              <Link
                href="/dashboard/tags"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Tag"
        description="Are you sure you want to delete the tag"
        itemName={tagName}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
