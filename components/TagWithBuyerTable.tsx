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
      console.log("Finished create tag attempt.");
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

      console.log("delete result",deleteResult)

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
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manage Tags</h1>
            <p className="text-gray-600">
              Create and manage tags to organize your buyers
            </p>
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
            <button
              onClick={cancelCreate}
              className="text-gray-500 hover:text-gray-700"
            >
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
                <label
                  htmlFor="tagName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
            {tags.map((tag, index) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <TagChip label={tag.name} index={index} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {tag.buyer_count} buyers
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`tags/edit/${tag.id}?buyer_count=${tag.buyer_count}`}
                  >
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => startDeleteTag(tag)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={deletingTag !== null}
        title="Delete Tag"
        description={description}
        isDeleting={isDeleting}
        isErrorDeleting={isErrorDeleting}
        onConfirm={confirmDeleteTag}
        onCancel={() => setDeletingTag(null)}
      />
    </div>
  );
}
