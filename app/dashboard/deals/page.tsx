"use client"; 

import Link from "next/link";
import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import { getWholesalerTags, sendDealsAction } from "@/app/actions/action";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react"; 
import { SendDealsState } from "@/libs/sendDealTypes";



function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition-colors disabled:opacity-50"
    >
      {pending ? "Sending..." : "Send Deal"}
    </button>
  );
}


export default function SendDealsPage() {

  const [tags, setTags] = useState<{id: string | number; name: string; api_id: string}[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])


  useEffect(() => {
    async function fetchData() {
      const fetchedTags = await getWholesalerTags(); 
      setTags(fetchedTags);
    }
    fetchData();
  }, []);


  const initialState: SendDealsState = { message: null, errors: {}, success: false };
  const [state, formAction] = useFormState(sendDealsAction, initialState);
  const [messageVisible,setMessageVisible]=useState(false)
    const [searchTerm, setSearchTerm] = useState("")
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMessageVisible(true)
    if (state.success) {
      formRef.current?.reset();
      
    
    }
      setTimeout(() => {
       setMessageVisible(false)
      }, 9000);
  }, [state.success, state.message,state.errors]);
    // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const dropdown = document.querySelector('[data-dropdown="tags"]')
      if (dropdown && !dropdown.contains(target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

   const filteredTags = tags.filter(
    (tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedTags.includes(tag.name),
  )


    const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }


  console.log("selected tags",selectedTags)
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
        <h1 className="text-2xl font-bold mb-2">Send Deals to Tags</h1>
        <p className="text-gray-600">
          Create and send targeted deals to specific buyer segments
        </p>
      </div>

      {state.message && state.success && messageVisible && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">
          {state.message}
        </div>
      )}
      {state.errors?.api && messageVisible && (
         <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
           {state.errors.api}
         </div>
      )}

      <form ref={formRef} action={formAction} className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500 mb-4">
          Select tags to target specific buyer groups:
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {/* {tags.map(({ name, id, api_id }) => {
            return (
              <div key={id} className="flex items-center">
                <input
                  id={`tag-${id}`}
                  name="selectedApiIds"
                  value={api_id}
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`tag-${id}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {name}
                </label>
              </div>
            );
          })} */}
            {/* Multi-Select Dropdown */}
          <div className="relative" data-dropdown="tags">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between"
            >
              <span className="text-gray-500">
                {selectedTags.length === 0 ? "Select tags..." : `${selectedTags.length} tag(s) selected`}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Tag Options */}
                <div className="max-h-40 overflow-y-auto">
                  {filteredTags.length > 0 ? (
                    filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          toggleTag(tag.name)
                          setSearchTerm("")
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {tag.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      {searchTerm ? "No tags found" : "All tags selected"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {state.errors?.tags && (
          <p className="text-sm text-red-600 mt-[-1rem] mb-4">{state.errors.tags}</p>
        )}

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
           {state.errors?.subject && (
            <p className="text-sm text-red-600 mt-1">{state.errors.subject}</p>
          )}
        </div>

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
          {state.errors?.message && (
            <p className="text-sm text-red-600 mt-1">{state.errors.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}