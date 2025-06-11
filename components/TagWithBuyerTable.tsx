"use client";

import type React from "react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, X, Check, Edit, Trash } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { TagChip } from "@/components/tag-ship";
import {
  addTagToMailerlit,
  addTagToSupabase,
  deleteTag,
} from "@/app/actions/action";
import { useRouter } from "next/navigation";
import { TagWithBuyerCount } from "@/libs/tagTypes";

export const dynamic = "force-dynamic";
export default function TagWithBuyerTable({
  tagsList,
}: {
  tagsList: TagWithBuyerCount[];
}) {
  const router = useRouter();
  const [tags, setTags] = useState(tagsList);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isErrorDeleting, setIsErrorDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState("");

  useEffect(() => {
    setTags(tagsList);
  }, [tagsList]);

  // Delete tag state
  const [deletingTag, setDeletingTag] = useState<{
    id: number;
    name: string;
    api_id: string;
    buyer_count: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      setCreateMessage("Please enter a tag name.");
      return;
    }

    setIsCreating(true);
    setCreateMessage("");

    try {
      const newTagPayload = {
        name: newTagName.trim(),
      };

      const addTagResult = await addTagToMailerlit(newTagPayload);

      if (addTagResult.status && addTagResult.tagApiId) {
        const addTagToSupabaseResult = await addTagToSupabase({
          name: newTagPayload.name,
          api_id: addTagResult.tagApiId,
        });


        if(addTagToSupabaseResult.success){
          router.refresh();
          setCreateMessage("Tag created successfully!");
          setNewTagName("");
        }

        setTimeout(() => {
          setShowCreateForm(false);
          setCreateMessage("");
        }, 2000);
      } else {
        setCreateMessage(`Error: 'Failed to create tag in MailerLite.'}`);
      }
    } catch (error: any) {
      setCreateMessage(
        `Error: ${error.message || "An unexpected error occurred."}`
      );
    } finally {
      setIsCreating(false);
    }
  };
  const cancelCreate = () => {
    setShowCreateForm(false);
    setNewTagName("");
    setCreateMessage("");
  };

  const startDeleteTag = (tag: (typeof tags)[0]) => {
    setDeletingTag({
      id: tag.id,
      name: tag.name,
      api_id: tag.api_id,
      buyer_count: tag.buyer_count,
    });
  };

  const confirmDeleteTag = async () => {
    if (!deletingTag) return;

    setIsDeleting(true);

    try {
      const deleteResult = await deleteTag({
        tagId: deletingTag.id,
        tagApiId: deletingTag.api_id,
      });

      if (deleteResult.success) {
        setDeletingTag(null);
        router.refresh();
      } else {
        setIsErrorDeleting(true);
        setTimeout(() => {
          setIsErrorDeleting(false);
        }, 3000);
      }
    } catch (error: any) {
      console.error("Unexpected error during tag deletion:", error);
      setIsErrorDeleting(true);
      setTimeout(() => {
        setIsErrorDeleting(null);
      }, 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  let description =
    "Are you sure you want to delete this tag? This action cannot be undone.";

  if (deletingTag) {
    const tagName = deletingTag.name || "this tag";
    description = `Are you sure you want to delete the tag "${tagName}"?`;

    if (deletingTag.buyer_count > 0) {
      description += ` This will break its link to ${deletingTag.buyer_count} buyers.`;
    }

    description += ` This action cannot be undone.`;
  }


  return (
    <div className="space-y-0">
      {/* ←— Header & Create Button */}
      <div className="space-y-2 sm:space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs sm:text-base">Back to Dashboard</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Manage Tags</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Create and manage tags to organize your buyers
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base hover:bg-green-600 transition mb-4"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tag</span>
          </button>
        </div>
      </div>

      
      {showCreateForm && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
    onClick={cancelCreate} // click fuera cierra
  >
    {/* Modal content */}
    <div
      className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
      onClick={(e) => e.stopPropagation()} // que no cierre al hacer click dentro
    >
      {/* Botón Cerrar */}
      <button
        onClick={cancelCreate}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-lg font-semibold mb-4">Create New Tag</h2>

      {createMessage && (
        <div className="mb-4 flex items-center gap-2 p-2 bg-green-100 text-green-800 rounded">
          <Check className="w-4 h-4" />
          <span>{createMessage}</span>
        </div>
      )}

      <form onSubmit={handleCreateTag} className="space-y-4">
        <div>
          <label
            htmlFor="tagName"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            Tag Name *
          </label>
          <input
            id="tagName"
            type="text"
            required
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Enter tag name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={cancelCreate}
            className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {isCreating ? (
              <div className="animate-spin h-4 w-4 border-2 border-t-white border-b-white rounded-full" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isCreating ? "Creating..." : "Create Tag"}</span>
          </button>
        </div>
      </form>
      </div>
    </div>
)}

      {/* ←— Mobile: Card List */}
      <div className="space-y-4 md:hidden">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white rounded-lg shadow p-4 space-y-2">
            <div className="flex justify-between items-start">
              <TagChip label={tag.name} index={0} />
              <div className="flex items-center space-x-2">
                <Link href={`tags/edit/${tag.id}?buyer_count=${tag.buyer_count}`}>
                  <button className="text-gray-600 hover:text-gray-900 text-sm sm:text-base">
                    <Edit className="w-5 h-5" />
                  </button>
                </Link>
                <button onClick={() => startDeleteTag(tag)} className="text-red-600 hover:text-red-900 text-sm sm:text-base">
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">{tag.buyer_count} buyers</div>
          </div>
        ))}
      </div>

      {/* ←— Desktop: Overflow-scroll Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Tag
              </th>
              <th className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Buyers
              </th>
              <th className="px-6 py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <TagChip label={tag.name} index={0} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {tag.buyer_count} buyers
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`tags/edit/${tag.id}?buyer_count=${tag.buyer_count}`}>
                    <button className="text-gray-600 hover:text-gray-900 mr-3 text-sm sm:text-base">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <button onClick={() => startDeleteTag(tag)} className="text-red-600 hover:text-red-900 text-sm sm:text-base">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ←— Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingTag)}
        title="Delete Tag"
        description={'/* your computed description */'}
        isDeleting={isDeleting}
        isErrorDeleting={isErrorDeleting}
        onConfirm={confirmDeleteTag}
        onCancel={() => setDeletingTag(null)}
      />
    </div>
  );
}
