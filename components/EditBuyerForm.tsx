"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash, X } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { deleteBuyer, updateBuyerAndTagsAction } from "@/app/actions/action";
import { useRouter } from "next/navigation";

interface Tag {
  id: number | string;
  name: string;
  api_id: string;
}

interface BuyerTagLink {
  tags: Tag;
}

interface Buyer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_num: string;
  buyer_tags: BuyerTagLink[];
  api_id: string;
}

interface Props {
  buyer: Buyer;
  availableTags: Tag[];
}

export default function EditBuyerForm({ buyer, availableTags }: Props) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_num: "",
  });

  const router = useRouter();
  const [buyerUpdatedSuccessfuly, setBuyerUpdatedSuccessfuly] = useState(false);

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const tagInputContainerRef = useRef<HTMLDivElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (buyer) {
      setFormData({
        first_name: buyer.first_name || "",
        last_name: buyer.last_name || "",
        email: buyer.email || "",
        phone_num: buyer.phone_num || "",
      });

      const initialSelectedTags = buyer.buyer_tags
        ? buyer.buyer_tags.map((link) => link.tags).filter((tag) => tag != null)
        : [];
      setSelectedTags(initialSelectedTags);
    }
  }, [buyer]);

  // Calculate tags available to add (availableTags are Tag[], selectedTags are Tag[])
  const tagsAvailableToAdd = availableTags.filter(
    (availTag) => !selectedTags.some((selTag) => selTag.id === availTag.id) // Direct comparison works now
  );

  const filteredTagsForDropdown = tagsAvailableToAdd.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRemoveTag = (tagToRemove: Tag) => {
    setSelectedTags((prevTags) =>
      prevTags.filter((tag) => tag.id !== tagToRemove.id)
    );
  };

  const handleAddTag = (tagToAdd: Tag) => {
    if (!selectedTags.some((t) => t.id === tagToAdd.id)) {
      setSelectedTags((prevTags) => [...prevTags, tagToAdd]);
    }
    setTagSearchTerm("");
    setIsTagDropdownOpen(false);
    tagInputRef.current?.focus();
  };

  const handleClickOutsideTags = useCallback((event: MouseEvent) => {
    if (
      tagInputContainerRef.current &&
      !tagInputContainerRef.current.contains(event.target as Node)
    ) {
      setIsTagDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isTagDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutsideTags);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideTags);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideTags);
    };
  }, [isTagDropdownOpen, handleClickOutsideTags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    const tagsPayload = selectedTags.map((tag) => ({
      id: tag.id,
      api_id: tag.api_id,
    }));

    const payload = {
      buyerId: buyer.id,
      updates: formData,
      tags: tagsPayload,
      buyerApiId: buyer.api_id,
    };

    // --- Call the Server Action ---
    const result = await updateBuyerAndTagsAction(payload);


    if (result.success) {
      setBuyerUpdatedSuccessfuly(true);
      setSaveMessage("Buyer updated successfully");
      router.push("/dashboard/");
    } else {
      setBuyerUpdatedSuccessfuly(false);
      setSaveMessage("error updating buyer");
    }

    setIsSaving(false);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    await deleteBuyer({ buyerId: buyer.id, buyerApiId: buyer.api_id });

    setIsDeleting(false);
    setShowDeleteModal(false);
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Edit Buyer</h1>
        <p className="text-gray-600">
          Update buyer information and manage tags
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            {/* Last Name */}
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Smith"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone_num"
                name="phone_num"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="(555) 123-4567"
                value={formData.phone_num}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* --- Tags Section --- */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div
              className="relative flex flex-wrap gap-2 items-center p-2 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 min-h-[42px]"
              ref={tagInputContainerRef}
              onClick={() => tagInputRef.current?.focus()}
            >
              {/* Render pills from the flat Tag[] state */}
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="flex items-center gap-1 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(tag);
                    }}
                    className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                    aria-label={`Remove ${tag.name}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}

              {/* Input field and Dropdown */}
              <div className="relative flex-grow min-w-[120px]">
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagSearchTerm}
                  onChange={(e) => {
                    setTagSearchTerm(e.target.value);
                    setIsTagDropdownOpen(true);
                  }}
                  onFocus={() => setIsTagDropdownOpen(true)}
                  placeholder={
                    selectedTags.length === 0 ? "Add tags..." : "Add more..."
                  }
                  className="w-full px-1 py-0.5 outline-none bg-transparent text-sm"
                />
                {/* Dropdown Panel */}
                {isTagDropdownOpen && filteredTagsForDropdown.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    <ul>
                      {filteredTagsForDropdown.map((option) => (
                        <li
                          key={option.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddTag(option);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-green-50 text-sm"
                        >
                          {option.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {isTagDropdownOpen &&
                  tagSearchTerm &&
                  filteredTagsForDropdown.length === 0 && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
                      <p className="text-sm text-gray-500">No matching tags</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* --- End Tags Section --- */}

          {/* Save Message */}
          {saveMessage && (
            <div
              className={`mb-4 p-2 rounded-md ${
                !buyerUpdatedSuccessfuly
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {saveMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash className="w-4 h-4" />
              <span>Delete Buyer</span>
            </button>
            {/* Cancel & Save */}
            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
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
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
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
        title="Delete Buyer"
        description={`Are you sure you want to delete the buyer "${formData.first_name} ${formData.last_name}"?`}
        itemName={`${formData.first_name} ${formData.last_name}`}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
