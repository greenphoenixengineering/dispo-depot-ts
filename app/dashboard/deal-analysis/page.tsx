"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SpaceEstimator } from "@/components/space-estimator"
import { AIAnalysisLoading } from "@/components/ai-analysis-loading"
import { AnalysisResults } from "@/components/analysis-results"
import { ARVLoading } from "@/components/arv-loading"
import { ARVResults } from "@/components/arv-results"
import { SendDealForm } from "@/components/send-deal-form"
import { PizzaTracker } from "@/components/pizza-tracker"

interface SpaceData {
  size: string
  materials: string
  image: File | null
  imagePreview: string | null
  repair_description: string
  repair_level: "light" | "moderate" | "heavy"
}

interface DealData {
  spaces: SpaceData[]
}

// Mock data for testing Step 3 (AI Analysis)
const mockMaterials = [
  {
    name: "Drywall Sheets (4x8)",
    quantity: "12 sheets",
    stores: [
      { name: "Home Depot", price: 15.98, inStock: true },
      { name: "Lowe's", price: 16.25, inStock: true },
      { name: "Menards", price: 14.99, inStock: false },
    ],
  },
  {
    name: "Interior Paint (Gallon)",
    quantity: "3 gallons",
    stores: [
      { name: "Home Depot", price: 42.98, inStock: true },
      { name: "Lowe's", price: 44.99, inStock: true },
      { name: "Sherwin Williams", price: 39.99, inStock: true },
    ],
  },
  {
    name: "Flooring (Luxury Vinyl)",
    quantity: "250 sq ft",
    stores: [
      { name: "Home Depot", price: 2.98, inStock: true },
      { name: "Lowe's", price: 3.15, inStock: true },
      { name: "Floor & Decor", price: 2.79, inStock: true },
    ],
  },
]

export default function DealAnalysisPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [numberOfSpaces, setNumberOfSpaces] = useState<number | null>(null)
  const [dealData, setDealData] = useState<DealData>({ spaces: [] })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [propertyAddress, setPropertyAddress] = useState("")
  const [isCalculatingARV, setIsCalculatingARV] = useState(false)
  const [hasTriggeredARV, setHasTriggeredARV] = useState(false)
  const [selectedRepairTotal, setSelectedRepairTotal] = useState(0)
  const [selectedVendors, setSelectedVendors] = useState<{ [materialIndex: number]: number }>({})
  const [laborCosts, setLaborCosts] = useState(0)

  const steps = ["Property Address", "Space Info", "AI Analysis", "ARV Calculation", "Send Deal"]

  const handleAddressSubmit = () => {
    if (propertyAddress.trim()) {
      setCurrentStep(1)
    }
  }

  const handleSpaceCountSubmit = (count: number) => {
    setNumberOfSpaces(count)
    const initialSpaces: SpaceData[] = Array(count)
      .fill(null)
      .map(() => ({
        size: "",
        materials: "",
        image: null,
        imagePreview: null,
        repair_description: "",
        repair_level: "moderate" as const,
      }))
    setDealData({ spaces: initialSpaces })
  }

  const handleSpaceUpdate = (index: number, spaceData: SpaceData) => {
    const updatedSpaces = [...dealData.spaces]
    updatedSpaces[index] = spaceData
    setDealData({ spaces: updatedSpaces })
  }

  const canProceedToNextStep = () => {
    return dealData.spaces.every(
      (space) =>
        space.size.trim() !== "" &&
        space.materials.trim() !== "" &&
        space.repair_description.trim() !== "" &&
        space.image !== null,
    )
  }

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(2)
      setIsAnalyzing(true)

      setTimeout(() => {
        setIsAnalyzing(false)
      }, 5000)

      console.log("Deal data ready for AI analysis:", dealData)
    }
  }

  const handleBackToSpaces = () => {
    setCurrentStep(1)
    setIsAnalyzing(false)
  }

  const handleProceedToStep4 = (selectedTotal: number, selectedVendors: { [materialIndex: number]: number }) => {
    setSelectedRepairTotal(selectedTotal)
    setSelectedVendors(selectedVendors)
    setCurrentStep(3)
    // Automatically trigger ARV calculation
    setHasTriggeredARV(true)
    setIsCalculatingARV(true)

    setTimeout(() => {
      setIsCalculatingARV(false)
    }, 5000)
  }



  const handleProceedToStep5 = (finalLaborCosts: number) => {
    setLaborCosts(finalLaborCosts)
    setCurrentStep(4)
    console.log("Proceeding to Send Deal step")
  }

  const handleBackToStep4 = () => {
    setCurrentStep(3)
  }

  const calculateTotalCost = () => {
    return mockMaterials.reduce((total, material) => {
      const lowestPrice = Math.min(...material.stores.filter((store) => store.inStock).map((store) => store.price))
      const quantity = Number.parseInt(material.quantity.split(" ")[0])
      return total + lowestPrice * quantity
    }, 0)
  }

  const handleBackToStep3 = () => {
    setCurrentStep(2)
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Deal Analysis</h1>
        <p className="text-gray-600">Complete workflow for analyzing and sending deals to buyers</p>
      </div>

      <PizzaTracker currentStep={currentStep} steps={steps} />

      {/* Step 1: Property Address Input */}
      {currentStep === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Property Information</h2>
          <p className="text-gray-600 mb-6">
            Enter the property address to get started with your deal analysis. We'll use this to gather basic property information.
          </p>

          <div className="space-y-4 max-w-md">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Property Address
              </label>
              <input
                type="text"
                id="address"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="123 Main St, City, State 12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end items-center mt-6">
            <button
              onClick={handleAddressSubmit}
              disabled={!propertyAddress.trim()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Space Information
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Space Information Collection */}
      {currentStep === 1 && (
        <div>
          {numberOfSpaces === null ? (
            // Space Count Selection
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Property: {propertyAddress}</h2>
                <p className="text-gray-600">How many spaces do you want to estimate for this property?</p>
              </div>
              <p className="text-gray-600 mb-6">
                Select the number of rooms or parts of the house you need to analyze for this deal.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSpaceCountSubmit(num)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
                  >
                    <span className="text-2xl font-bold text-gray-700">{num}</span>
                    <p className="text-sm text-gray-500 mt-1">{num === 1 ? "Space" : "Spaces"}</p>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">You can select between 1-10 spaces for analysis</p>
              </div>
            </div>
          ) : (
            // Space Information Collection
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setNumberOfSpaces(null)
                      setDealData({ spaces: [] })
                    }}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <h2 className="text-xl font-semibold">
                    Property: {propertyAddress}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {numberOfSpaces} {numberOfSpaces === 1 ? "Space" : "Spaces"}
                  </span>
                  <button
                    onClick={() => {
                      setNumberOfSpaces(null)
                      setDealData({ spaces: [] })
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Change number of spaces
                  </button>
                </div>
              </div>

              {dealData.spaces.map((space, index) => (
                <SpaceEstimator
                  key={index}
                  spaceNumber={index + 1}
                  onSpaceUpdate={(spaceData) => handleSpaceUpdate(index, spaceData)}
                  initialData={space}
                />
              ))}

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">Ready to proceed?</h3>
                    <p className="text-sm text-gray-600">
                      Make sure all spaces have complete information before continuing.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNextStep()}
                    disabled={!canProceedToNextStep()}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to AI Analysis
                  </button>
                </div>

                {!canProceedToNextStep() && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please complete all required fields (size, materials, description, image, and repair level) for
                      each space before proceeding.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: AI Analysis */}
      {currentStep === 2 && (
        <div>
          {isAnalyzing ? (
            <AIAnalysisLoading />
          ) : (
            <AnalysisResults
              materials={mockMaterials}
              totalCost={calculateTotalCost()}
              onNext={handleProceedToStep4}
              onBack={handleBackToSpaces}
            />
          )}
        </div>
      )}

      {/* Step 4: ARV Calculation */}
      {currentStep === 3 && (
        <div>
          {isCalculatingARV ? (
            <ARVLoading />
          ) : (
            <ARVResults
              address={propertyAddress}
              arv={285000}
              repairCosts={selectedRepairTotal}
              onNext={handleProceedToStep5}
              onBack={handleBackToStep3}
            />
          )}
        </div>
      )}

      {/* Step 5: Send Deal */}
      {currentStep === 4 && (
        <SendDealForm
          dealData={{
            address: propertyAddress,
            arv: 285000,
            repairCosts: selectedRepairTotal,
            laborCosts: laborCosts,
            mao: Math.round(285000 * 0.7 - selectedRepairTotal - laborCosts),
            spaces: dealData.spaces,
          }}
          onBack={handleBackToStep4}
        />
      )}
    </div>
  )
}
