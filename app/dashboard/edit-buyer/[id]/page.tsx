"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash } from "lucide-react";
import { getBuyerById } from "@/libs/data";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { SearchableSelect } from "@/components/SearchableSelect";

interface Buyer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  tags: { name: string }[];
}

interface Props {
  params: { id: string };
}

export default function EditBuyerPage({ params }: Props) {
  const buyerId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [tag, setTag] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const availableTags = [
    "Retail",
    "Wholesale",
    "VIP",
    "New",
    "Inactive",
    "High Value",
    "Local",
    "International",
  ];

  useEffect(() => {
    const buyer = {
      id: "1",
      first_name: "John Smith",
      last_name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      tags: [{ name: "Retail" }, { name: "VIP" }],
      company: "Acme Corp",
    };

    if (buyer) {
      setFormData({
        first_name: buyer.first_name,
        last_name: buyer.last_name,
        email: buyer.email,
        phone: buyer.phone,
        company: buyer.company || "",
      });
      // Set the first tag if available, otherwise empty string
      setTag(buyer.tags.length > 0 ? buyer.tags[0].name : "");
    }
    setIsLoading(false);
  }, [buyerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would send the data to your API
    console.log("Form submitted:", { ...formData, tag, id: buyerId });

    setIsSaving(false);
    setSaveMessage("Buyer updated successfully!");

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would send a delete request to your API
    console.log("Buyer deleted:", buyerId);

    setIsDeleting(false);
    setShowDeleteModal(false);

    // Redirect to dashboard
    window.location.href = "/dashboard";
  };

  // Callback for the SearchableSelect component
  const handleTagChange = useCallback((newValue: string) => {
    setTag(newValue);
  }, []);

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
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="John Smith"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="John Smith"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

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

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Tag Searchable Select */}
          <div className="mb-6">
            <label
              htmlFor="tag"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tag (Optional)
            </label>
            <SearchableSelect
              options={availableTags}
              value={tag}
              onChange={handleTagChange}
              placeholder="Select a tag..."
              allowClear={true}
            />
          </div>

          {saveMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-md">
              {saveMessage}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash className="w-4 h-4" />
              <span>Delete Buyer</span>
            </button>

            <div className="flex gap-3">
              <Link
                href="/dashboard"
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
        title="Delete Buyer"
        description="Are you sure you want to delete the buyer"
        itemName={formData.first_name}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
