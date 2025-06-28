"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { getSingleTag, UpdateTag } from "@/app/actions/supabase";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function EditTagPage({ params }: Props) {
  const searchParams = useSearchParams();
  const TagbuyerCount = searchParams.get("buyer_count");
  const tagId = Number.parseInt(params.id);
  const [isLoading, setIsLoading] = useState(true);
  const [tagName, setTagName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [tag, setTag] = useState(undefined);
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchTagData = async () => {
      if (tagId === null || typeof tagId === "undefined") {
        setIsLoading(false);
        setTagName("");
        return;
      }

      setIsLoading(true);
      try {
        const tagsArray = await getSingleTag(tagId);
        if (tagsArray && tagsArray.length > 0) {
          const singleTag = tagsArray[0];
          setTagName(singleTag.name);
          setTag(tagsArray[0]);
        } else {
          console.warn(
            `Tag with ID ${tagId} not found or getSingleTag returned no data.`
          );
          setTagName("");
        }
      } catch (error) {
        console.error("Error fetching single tag:", error);
        setTagName("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTagData();
  }, [tagId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tagId || !tag || !tag.api_id) {
      setSaveMessage("Error: Missing tag information. Cannot update.");
      console.error("Missing critical data for tag update:", { tagId, tag });
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    try {
      const updatePayload = {
        tagId: tagId,
        tagApiId: tag.api_id,
        newTagName: tagName,
      };

      const updateResult = await UpdateTag(updatePayload);

      if (updateResult && updateResult.success) {
        setSaveMessage("Tag updated successfully!");
         router.prefetch("/dashboard/tags")
        router.push("/dashboard/tags");
      } else {
        setError(true);
        setSaveMessage("error updating tag");
      }
    } catch (error: any) {
      setSaveMessage(
        `Error: ${
          error.message || "An unexpected error occurred while updating."
        }`
      );
    } finally {
      setIsSaving(false);
    }

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/tags"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
        >
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
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
              <p className="mt-2 text-sm text-gray-500">
                {TagbuyerCount} buyers are currently using this tag
              </p>
            </div>
          </div>

          {saveMessage && (
            <div
              className={`p-3 my-2 rounded-md text-sm font-medium ${
                error
                  ? "bg-red-100 border border-red-300 text-red-700"
                  : "bg-green-100 border border-green-300 text-green-700"
              }`}
              role="alert"
            >
              {saveMessage}
            </div>
          )}

          <div className="flex justify-between">
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
    </div>
  );
}
