"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, X, Save } from "lucide-react";
import  { addBuyerToMailerLit, linkBuyerToTag ,addBuyer} from "@/app/actions/action";

export default function AddBuyerForm({tags}:{tags:any}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
   groupId:''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string>("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleTagSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTagId(e.target.value);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await addBuyerToMailerLit(formData);
    if(!result.status)return
    const newBuyerWithMailerSubId = {...formData,api_id:result.newSubscriberId}

    const addedBuyer=await addBuyer(newBuyerWithMailerSubId)

    const linkBuyerAndTag=await linkBuyerToTag({buyer_id:addedBuyer[0]?.id,tag_id:selectedTagId})
    console.log("linked buyer and tag",linkBuyerAndTag)


    setIsSaving(false);
    setSaveMessage("Buyer created successfully!");

    // Clear form after successful submission
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      groupId: "",
    });

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
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
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
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
              onChange={(e) =>{
                const selectedTag = tags?.find(tags => tags.api_id === e.target.value);
                setSelectedTagId(selectedTag.id)
                setFormData((prev) => ({
                  ...prev,
                  groupId: e.target.value,
                }))
              }}
            >
              <option value="">Select a tag</option>
              {tags?.map((tag) => (
                <option key={tag.id} value={tag.api_id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {saveMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-md">
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
