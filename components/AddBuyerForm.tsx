"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import {
  
  linkBuyerToTag,
  addBuyer,
  increaseBuyerCount,
} from "@/app/actions/supabase";
import { useRouter } from "next/navigation";
import { addBuyerToMailerLit } from "@/app/actions/mailerLite";

export default function AddBuyerForm({ tags }: { tags: any }) {
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_num: "",
    groupId: "",
  });
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    try {
      const result = await addBuyerToMailerLit(formData);
  


      if (!result?.status || !result?.newSubscriberId) {
        throw new Error("Failed to add buyer to MailerLite.");
      }

      const newBuyerWithMailerSubId = {
        ...formData,
        api_id: result.newSubscriberId,
      };

      const addedBuyer = await addBuyer(newBuyerWithMailerSubId);
      if (!addedBuyer[0]?.id) {
        throw new Error("Failed to add buyer to database.");
      }

      await linkBuyerToTag({
        buyer_id: addedBuyer[0]?.id,
        tag_id: selectedTagId,
      });


      // INCREASE BUYER COUNT FOR THE WHOLESALER
      const data= await increaseBuyerCount();

      console.log("increase count data",data)

      setSaveMessage("Buyer created successfully!");

      // Clear form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_num: "",
        groupId: "",
      });

      router.push("/dashboard/");
    } catch (error: any) {
      const duplicateKey = "duplicate key value violates unique constraint";
      const isDuplicate = error.message?.includes(duplicateKey);

      setError(true);
      setSaveMessage(
        isDuplicate
          ? "This buyer already exists "
          : error.message || "An unexpected error occurred."
      );
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSaveMessage("");
        setError(false);
      }, 4000);
    }
  };

  return (
    <div>
      <div className="mb-6">        
        <h1 className="text-2xl font-bold mb-2">Add New Buyer</h1>
        <p className="text-gray-600">Create a new buyer profile</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="name"
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
            <div>
              <label
                htmlFor="name"
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

          <div className="mb-6">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags
            </label>
            <select
              id="tags"
              name="tags"
              className="w-full p-2 border rounded-md mb-2"
              value={formData.groupId}
              required
              onChange={(e) => {
                const selectedTag = tags?.find(
                  (tags: any) => tags.api_id === e.target.value
                );
                setSelectedTagId(selectedTag.id);
                setFormData((prev) => ({
                  ...prev,
                  groupId: e.target.value,
                }));
              }}
            >
              <option value="">Select a tag</option>
              {tags?.map((tag: any) => (
                <option key={tag.id} value={tag.api_id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {saveMessage && (
            <div
              className={`mb-4 p-2 rounded-md ${
                error
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {saveMessage}
            </div>
          )}

          <div className="flex justify-end gap-3">
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
                  <span>Create Buyer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
