// app/dashboard/deals/page.tsx

"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

const ALL_TAGS = ["Retail", "Wholesale", "VIP", "New"];

export default function SendDealsPage() {
  // State para tags seleccionados
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Maneja la selección desde el <select>
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !selectedTags.includes(value)) {
      setSelectedTags((prev) => [...prev, value]);
    }
    // Resetear el <select> para que siempre muestre la opción por defecto
    e.target.value = "";
  };

  // Elimina una tag de los seleccionados
  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <>
      <Head>
        <title>Send Deals to Tags | Dashboard</title>
        <meta
          name="description"
          content="Create and send targeted deals to specific buyer segments from your dashboard."
        />
      </Head>

      <main className="w-full max-w-md mx-auto px-3 py-4">
        {/* Back Navigation */}
        <nav className="flex items-center mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Back to Dashboard</span>
          </Link>
        </nav>

        {/* Page Header */}
        <section className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-1">
            Send Deals to Tags
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            Create and send targeted deals to specific buyer segments
          </p>
        </section>

        {/* Form Section */}
        <section className="bg-white rounded-lg shadow p-4">
          {/* Tag Selection: ahora con <select> y chips */}
          <div className="mb-4">
            <label
              htmlFor="tag-select"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              Select tags to target specific buyer groups:
            </label>
            <select
              id="tag-select"
              onChange={handleSelectChange}
              className="
                w-full
                px-3 py-2
                border border-gray-300
                rounded-md
                bg-white
                text-sm
                sm:text-base
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
              "
            >
              <option value="" disabled selected>
                Choose a tag…
              </option>
              {ALL_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Chips de tags seleccionadas */}
            {selectedTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="
                      inline-flex items-center
                      bg-green-100 text-green-800
                      rounded-full
                      px-3 py-1
                      text-xs font-medium
                    "
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="
                        ml-2
                        focus:outline-none
                        hover:bg-green-200
                        rounded-full
                        p-0.5
                      "
                    >
                      <X className="w-3 h-3 text-green-800" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Subject Line Input */}
          <div className="mb-3">
            <label
              htmlFor="subject"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Subject Line
            </label>
            <input
              type="text"
              id="subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
              placeholder="Enter email subject line"
            />
          </div>

          {/* Message Textarea */}
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
              placeholder="Enter your message here..."
            ></textarea>
          </div>

          {/* Send Button */}
          <div className="flex justify-center">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-500 text-white rounded-md px-4 py-2 text-xs sm:text-sm hover:bg-green-600 transition-colors"
            >
              Send Deal
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
