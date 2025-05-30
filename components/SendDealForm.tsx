"use client";

import { ChevronDown, X, Search } from "lucide-react";
import { sendDealsAction } from "@/app/actions/action";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { SendDealsState } from "@/libs/sendDealTypes";
import { SubmitButton } from "./SubmitButton";
import { Tag } from "@/libs/tagTypes";
import MultiSelectTagsDropDown from "./MultiSelectTagsDropDown";

export default function SendDealForm({ tags }: { tags: Tag[] }) {
  const initialState: SendDealsState = {
    message: null,
    errors: {},
    success: false,
  };
  const [formState, formAction] = useFormState(sendDealsAction, initialState);
  const [messageVisible, setMessageVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [selectedTagObjects, setSelectedTagObjects] = useState<any[]>([]);

  useEffect(() => {
    if (
      formState.message ||
      (formState.errors && Object.keys(formState.errors).length > 0)
    ) {
      setMessageVisible(true);
      const timer = setTimeout(() => {
        setMessageVisible(false);
      }, 4000);

      if (formState.success) {
        formRef.current?.reset();
        setSelectedTagObjects([]);
        // setSearchTerm("");
        // setIsDropdownOpen(false);
      }
      return () => clearTimeout(timer);
    }
  }, [formState]);

  return (
    <div>
      {/* Form Submission Messages */}
      {messageVisible && formState.success && formState.message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">
          {formState.message}
        </div>
      )}
      {messageVisible && formState.errors?.api && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {formState.errors.api}
        </div>
      )}

      <form
        ref={formRef}
        action={formAction}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        {/* Hidden inputs for selected tag API IDs */}
        {selectedTagObjects.map((tag) => (
          <input
            key={`hidden-${tag.api_id}`}
            type="hidden"
            name="selectedTagsApiId"
            value={tag.api_id}
          />
        ))}

        {/* Tag Selection Section (New UI) */}
        <MultiSelectTagsDropDown
          tags={tags}
          selectedTagObjects={selectedTagObjects}
          setSelectedTagObjects={setSelectedTagObjects}
        />
        {messageVisible && formState.errors?.tags && (
          <p className="text-sm text-red-600 mt-1">{formState.errors.tags}</p>
        )}

        {/* Subject Line Input */}
        <div className="mb-4">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject Line
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter email subject line"
          />
          {messageVisible && formState.errors?.subject && (
            <p className="text-sm text-red-600 mt-1">
              {formState.errors.subject}
            </p>
          )}
        </div>

        {/* Message Textarea */}
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your message here..."
          ></textarea>
          {messageVisible && formState.errors?.message && (
            <p className="text-sm text-red-600 mt-1">
              {formState.errors.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
