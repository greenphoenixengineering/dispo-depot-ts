"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X } from "lucide-react"

interface SpaceData {
  size: string
  materials: string
  image: File | null
  imagePreview: string | null
  repair_description: string
  repair_level: "light" | "moderate" | "heavy"
}

interface SpaceEstimatorProps {
  spaceNumber: number
  onSpaceUpdate: (spaceData: SpaceData) => void
  initialData?: SpaceData
}

export function SpaceEstimator({ spaceNumber, onSpaceUpdate, initialData }: SpaceEstimatorProps) {
  const [spaceData, setSpaceData] = useState<SpaceData>(
    initialData || {
      size: "",
      materials: "",
      image: null,
      imagePreview: null,
      repair_description: "",
      repair_level: "moderate",
    },
  )

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const updatedData = {
          ...spaceData,
          image: file,
          imagePreview: e.target?.result as string,
        }
        setSpaceData(updatedData)
        onSpaceUpdate(updatedData)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    const updatedData = {
      ...spaceData,
      image: null as File | null,
      imagePreview: null as string | null,
    }
    setSpaceData(updatedData)
    onSpaceUpdate(updatedData)
  }

  const handleInputChange = (field: keyof SpaceData, value: string) => {
    const updatedData = {
      ...spaceData,
      [field]: value,
    }
    setSpaceData(updatedData)
    onSpaceUpdate(updatedData)
  }

  const handleRepairLevelChange = (level: "light" | "moderate" | "heavy") => {
    const updatedData = {
      ...spaceData,
      repair_level: level,
    }
    setSpaceData(updatedData)
    onSpaceUpdate(updatedData)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Space {spaceNumber}</h3>

      {/* Job Details Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size of Job</label>
            <input
              type="text"
              value={spaceData.size}
              onChange={(e) => handleInputChange("size", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Small bathroom, Large living room, Entire kitchen"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Materials Needed</label>
            <input
              type="text"
              value={spaceData.materials}
              onChange={(e) => handleInputChange("materials", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Drywall, paint, flooring, fixtures"
            />
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
        {!spaceData.imagePreview ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id={`image-upload-${spaceNumber}`}
            />
            <label htmlFor={`image-upload-${spaceNumber}`} className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload an image</p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
        ) : (
          <div className="relative">
            <img
              src={spaceData.imagePreview || "/placeholder.svg"}
              alt="Space preview"
              className="w-full max-w-md mx-auto rounded-lg shadow-sm"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Repair Level</label>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(["light", "moderate", "heavy"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleRepairLevelChange(level)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                spaceData.repair_level === level
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Repair Description</label>
        <textarea
          rows={4}
          value={spaceData.repair_description}
          onChange={(e) => handleInputChange("repair_description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Describe what's in the image and what needs to be repaired or renovated."
        />
      </div>
    </div>
  )
}
