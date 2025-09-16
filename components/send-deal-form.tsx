"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ChevronDown, X, Search } from "lucide-react"

interface DealData {
  address: string
  arv: number
  repairCosts: number
  laborCosts: number
  mao: number
  spaces: Array<{
    size: string
    materials: string
    repair_description: string
    repair_level: "light" | "moderate" | "heavy"
  }>
}

interface SendDealFormProps {
  dealData: DealData
  onBack: () => void
}

export function SendDealForm({ dealData, onBack }: SendDealFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const availableTags = ["Retail", "Wholesale", "VIP", "New", "Inactive", "High Value", "Local", "International"]

  const filteredTags = availableTags.filter(
    (tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedTags.includes(tag),
  )

  const repairCosts = Number(dealData.repairCosts) || 0
  const laborCosts = Number(dealData.laborCosts) || 0
  const totalCosts = repairCosts + laborCosts
  const calculatedMAO = Number(dealData.arv) * 0.7 - totalCosts

  // Generate AI email template
  useEffect(() => {
    const generateEmailTemplate = () => {
      const profit = calculatedMAO - totalCosts
      const roi = ((profit / calculatedMAO) * 100).toFixed(1)

      const subjectLine = `🏠 Investment Opportunity: ${dealData.address} - ARV $${dealData.arv.toLocaleString()}`

      const emailBody = `Hi there,

I hope this email finds you well! I wanted to share an exciting investment opportunity that just came across my desk.

**Property Details:**
📍 Address: ${dealData.address}
💰 After Repair Value (ARV): $${dealData.arv.toLocaleString()}
🔨 Estimated Repair Costs: $${repairCosts.toLocaleString()}
👷 Labor Costs: $${laborCosts.toLocaleString()}
📊 Maximum Allowable Offer (MAO): $${calculatedMAO.toLocaleString()}

**Investment Highlights:**
• Total renovation budget: $${totalCosts.toLocaleString()}
• Potential profit: $${profit.toLocaleString()}
• Estimated ROI: ${roi}%
• ${dealData.spaces.length} space${dealData.spaces.length > 1 ? "s" : ""} requiring renovation

**Renovation Scope:**
${dealData.spaces
  .map(
    (space, index) =>
      `${index + 1}. ${space.size} - ${space.repair_level} repairs needed
   Materials: ${space.materials}
   Work needed: ${space.repair_description}`,
  )
  .join("\n")}

This property offers excellent potential for the right investor. The numbers have been carefully analyzed using our AI-powered estimation system to ensure accuracy.

If you're interested in learning more or would like to schedule a viewing, please don't hesitate to reach out. I'm happy to provide additional details, comps, or answer any questions you might have.

Best regards,
[Your Name]
[Your Contact Information]

P.S. This is a time-sensitive opportunity, so please let me know your interest level as soon as possible.`

      setSubject(subjectLine)
      setMessage(emailBody)
    }

    generateEmailTemplate()
  }, [dealData, repairCosts, laborCosts, totalCosts, calculatedMAO])

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Send Deal to Buyers</h1>
        <p className="text-gray-600">AI-generated email template with your deal analysis</p>
      </div>

      {/* Deal Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Deal Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Property:</span>
            <p className="font-medium">{dealData.address}</p>
          </div>
          <div>
            <span className="text-gray-600">ARV:</span>
            <p className="font-medium">${dealData.arv.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-600">Total Costs:</span>
            <p className="font-medium">${totalCosts.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-600">MAO:</span>
            <p className="font-medium text-green-600">${calculatedMAO.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Tags to Target</label>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="text-green-800 hover:text-green-900">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

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
                        key={tag}
                        type="button"
                        onClick={() => {
                          toggleTag(tag)
                          setSearchTerm("")
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {tag}
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

        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject Line
            <span className="text-xs text-green-600 ml-2">✨ AI Generated</span>
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter email subject line"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
            <span className="text-xs text-green-600 ml-2">✨ AI Generated & Editable</span>
          </label>
          <textarea
            id="message"
            rows={16}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
            placeholder="Enter your message here..."
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to ARV Results
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Send Deal
          </button>
        </div>
      </div>
    </div>
  )
}
