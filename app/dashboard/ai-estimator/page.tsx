"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Send, DollarSign, Clock, Wrench } from "lucide-react"

interface EstimateResponse {
  totalCost: string
  laborCost: string
  materialCost: string
  timeEstimate: string
  breakdown: {
    item: string
    quantity: string
    unitCost: string
    totalCost: string
  }[]
  recommendations: string[]
}

export default function AIEstimatorPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage || !description.trim()) return

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock AI response based on description
    const mockEstimate: EstimateResponse = {
      totalCost: "$2,450 - $3,200",
      laborCost: "$1,200 - $1,600",
      materialCost: "$1,250 - $1,600",
      timeEstimate: "2-3 days",
      breakdown: [
        {
          item: "Drywall sheets (4x8 ft)",
          quantity: "6",
          unitCost: "$15",
          totalCost: "$90",
        },
        {
          item: "Joint compound",
          quantity: "2 buckets",
          unitCost: "$25",
          totalCost: "$50",
        },
        {
          item: "Paint (primer + finish)",
          quantity: "2 gallons",
          unitCost: "$45",
          totalCost: "$90",
        },
        {
          item: "Labor (skilled contractor)",
          quantity: "16 hours",
          unitCost: "$75",
          totalCost: "$1,200",
        },
        {
          item: "Tools & supplies",
          quantity: "1 set",
          unitCost: "$120",
          totalCost: "$120",
        },
      ],
      recommendations: [
        "Consider using moisture-resistant drywall if this is a bathroom or kitchen area",
        "Prime the wall before painting for better coverage and durability",
        "Allow 24-48 hours between coats for proper curing",
        "Get multiple quotes from licensed contractors in your area",
      ],
    }

    setEstimate(mockEstimate)
    setIsSubmitting(false)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">AI Estimator</h1>
        <p className="text-gray-600">Upload an image and get an instant repair/renovation cost estimate</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <form onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Upload Image</label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload an image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Uploaded preview"
                  className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Description Input */}
          <div className="mb-4 md:mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe what's in the image and what needs to be estimated."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mb-4 md:mb-6">
            <button
              type="submit"
              disabled={!selectedImage || !description.trim() || isSubmitting}
              className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-4 py-2 md:px-6 md:py-3 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Get Estimate</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Estimate Response */}
        {estimate && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
              Cost Estimate
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Total Cost</span>
                </div>
                <p className="text-lg md:text-2xl font-bold text-green-900">{estimate.totalCost}</p>
              </div>

              <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Time Estimate</span>
                </div>
                <p className="text-lg md:text-2xl font-bold text-blue-900">{estimate.timeEstimate}</p>
              </div>

              <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Labor Cost</span>
                </div>
                <p className="text-lg md:text-2xl font-bold text-purple-900">{estimate.laborCost}</p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Cost Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Item</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit Cost</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {estimate.breakdown.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{item.item}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.unitCost}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {estimate.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This is an AI-generated estimate based on the provided image and
                description. Actual costs may vary significantly based on location, material quality, contractor rates,
                and unforeseen complications. Always get multiple quotes from licensed professionals before starting any
                project.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
