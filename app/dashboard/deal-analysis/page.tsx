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
import { PropertyDataLoading } from "@/components/property-data-loading"
import { getPropertyDetails } from "@/app/actions/rapid"

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
  const [propertyDetails, setPropertyDetails] = useState<any>(null)
  const [isLoadingPropertyData, setIsLoadingPropertyData] = useState(false)
  const [isCalculatingARV, setIsCalculatingARV] = useState(false)
  const [hasTriggeredARV, setHasTriggeredARV] = useState(false)
  const [selectedRepairTotal, setSelectedRepairTotal] = useState(0)
  const [selectedVendors, setSelectedVendors] = useState<{ [materialIndex: number]: number }>({})
  const [laborCosts, setLaborCosts] = useState(0)

  const steps = ["Property Address", "Space Info", "AI Analysis", "ARV Calculation", "Send Deal"]

  const calculateDefaultSpaces = () => {
    if (!propertyDetails) return 5; // Default fallback
    
    const beds = propertyDetails.beds || 0;
    const baths = propertyDetails.baths || 0;
    
    // Calculate: beds + baths + kitchen + living room
    const totalSpaces = beds + baths + 2;
    
    // Ensure minimum of 3 spaces and maximum of 15
    return Math.max(3, Math.min(15, totalSpaces));
  }

  const handleAddressSubmit = async () => {
    if (propertyAddress.trim()) {
      try {
        // Show loading state
        setIsLoadingPropertyData(true);
        
        // Make API call to get property details
        const details = await getPropertyDetails(propertyAddress);
        console.log('Property details fetched:', details);
        
        // Store property details for use in space calculation
        setPropertyDetails(details);
        
        // Hide loading and proceed to next step
        setIsLoadingPropertyData(false);
        setCurrentStep(1);
      } catch (error) {
        console.error('Error in handleAddressSubmit:', error);
        // Hide loading and still proceed to next step even if API call fails
        setIsLoadingPropertyData(false);
        setCurrentStep(1);
      }
    }
  }

  const handleSpaceCountSubmit = (count: number) => {
    setNumberOfSpaces(count)
    const initialSpaces: SpaceData[] = Array(count)
      .fill(null)
      .map(() => ({
        size: "",
        materials: "",
        image: null as File | null,
        imagePreview: null as string | null,
        repair_description: "",
        repair_level: "moderate" as const,
      }))
    setDealData({ spaces: initialSpaces })
  }

  const addMoreSpaces = () => {
    const currentCount = dealData.spaces.length;
    const newSpace: SpaceData = {
      size: "",
      materials: "",
      image: null as File | null,
      imagePreview: null as string | null,
      repair_description: "",
      repair_level: "moderate" as const,
    }
    
    setDealData({ spaces: [...dealData.spaces, newSpace] })
    setNumberOfSpaces(currentCount + 1)
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
    <div className="px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4">
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-sm sm:text-base">Back to Dashboard</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Deal Analysis</h1>
        <p className="text-sm sm:text-base text-gray-600">Complete workflow for analyzing and sending deals to buyers</p>
      </div>

      <PizzaTracker currentStep={currentStep} steps={steps} />

      {/* Property Data Loading Screen */}
      {isLoadingPropertyData && (
        <PropertyDataLoading />
      )}

      {/* Step 1: Property Address Input */}
      {currentStep === 0 && !isLoadingPropertyData && (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Property Information</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
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
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end items-center mt-4 sm:mt-6">
            <button
              onClick={handleAddressSubmit}
              disabled={!propertyAddress.trim()}
              className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Property: {propertyAddress}</h2>                
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Select the number of rooms or spaces of the property you need to analyze for this deal.
              </p>

              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                  Based on your property ({propertyDetails?.beds || 0} beds, {propertyDetails?.baths || 0} baths), 
                  we recommend starting with <strong>{calculateDefaultSpaces()} spaces</strong> (including kitchen and living room).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {Array.from({ length: calculateDefaultSpaces() }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSpaceCountSubmit(num)}
                    className="p-2 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
                  >
                    <span className="text-lg sm:text-2xl font-bold text-gray-700">{num}</span>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{num === 1 ? "Space" : "Spaces"}</p>
                  </button>
                ))}
              </div>

              <div className="text-center space-y-2 sm:space-y-3 mb-4">
                <p className="text-xs sm:text-sm text-gray-500">
                  Need more spaces? You can do so in the following screen.
                </p>              
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Address
                </button>
                <div></div> {/* Spacer for consistent layout */}
              </div>
            </div>
          ) : (
            // Space Information Collection
            <div>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">
                  Property: {propertyAddress}
                </h2>              
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="text-md text-gray-600 mb-2">
                    For each space, provide detailed repair information so that the AI engine can put together a detailed BOM.
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">                  
                  <span className="text-sm text-gray-600">
                    Currently: {numberOfSpaces} {numberOfSpaces === 1 ? "Space" : "Spaces"}
                  </span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={addMoreSpaces}
                      className="text-xs sm:text-sm text-green-600 hover:text-green-800 border border-green-300 px-2 sm:px-3 py-1 rounded hover:bg-green-50 transition-colors"
                    >
                      + Add 1 More
                    </button>
                    <button
                      onClick={() => {
                        setNumberOfSpaces(null)
                        setDealData({ spaces: [] })
                      }}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Change number of spaces
                    </button>
                  </div>
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

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Ready to proceed?</h3>
                    <p className="text-sm text-gray-600">
                      Make sure all spaces have complete information before continuing.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNextStep()}
                    disabled={!canProceedToNextStep()}
                    className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to AI Analysis
                  </button>
                </div>

                {!canProceedToNextStep() && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-yellow-800">
                      Please complete all required fields (size, materials, description, image, and repair level) for
                      each space before proceeding.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={() => {
                    setNumberOfSpaces(null)
                    setDealData({ spaces: [] })
                  }}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Space Selection
                </button>
                <div></div> {/* Spacer for consistent layout */}
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
              onNext={() => handleProceedToStep5(0)}
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
      
      {/* Bottom spacing for mobile */}
      <div className="h-6 sm:h-8 lg:h-12"></div>
    </div>
  )
}
