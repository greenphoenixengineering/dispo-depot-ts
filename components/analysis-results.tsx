"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"

interface MaterialItem {
  name: string
  quantity: string
  stores: {
    name: string
    price: number
    inStock: boolean
  }[]
}

interface AnalysisResultsProps {
  materials: MaterialItem[]
  totalCost: number
  onNext: (selectedTotal: number, selectedVendors: { [materialIndex: number]: number }) => void
  onBack: () => void
}

export function AnalysisResults({ materials, totalCost, onNext, onBack }: AnalysisResultsProps) {
  const [selectedVendors, setSelectedVendors] = useState<{ [materialIndex: number]: number }>({})
  const [calculatedTotal, setCalculatedTotal] = useState(totalCost)

  useEffect(() => {
    const initialSelections: { [materialIndex: number]: number } = {}
    materials.forEach((material, materialIndex) => {
      const inStockStores = material.stores.filter((store) => store.inStock)
      if (inStockStores.length > 0) {
        const lowestPriceIndex = material.stores.findIndex(
          (store) => store.inStock && store.price === Math.min(...inStockStores.map((s) => s.price)),
        )
        initialSelections[materialIndex] = lowestPriceIndex
      }
    })
    setSelectedVendors(initialSelections)
  }, [materials])

  useEffect(() => {
    const total = materials.reduce((sum, material, materialIndex) => {
      const selectedStoreIndex = selectedVendors[materialIndex]
      if (selectedStoreIndex !== undefined && material.stores[selectedStoreIndex]) {
        return sum + material.stores[selectedStoreIndex].price
      }
      return sum
    }, 0)
    setCalculatedTotal(total)
  }, [selectedVendors, materials])

  const handleVendorSelect = (materialIndex: number, storeIndex: number) => {
    setSelectedVendors((prev) => ({
      ...prev,
      [materialIndex]: storeIndex,
    }))
  }

  const handleNext = () => {
    onNext(calculatedTotal, selectedVendors)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Material Analysis Complete</h2>
          <p className="text-gray-600 mb-6">
            Select your preferred vendor for each material to calculate your total cost
          </p>

          <div className="space-y-6">
            {materials.map((material, materialIndex) => (
              <div key={materialIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{material.name}</h3>
                  <span className="text-sm text-gray-500">Qty: {material.quantity}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {material.stores.map((store, storeIndex) => {
                    const isSelected = selectedVendors[materialIndex] === storeIndex
                    const isClickable = store.inStock

                    return (
                      <div
                        key={storeIndex}
                        onClick={() => isClickable && handleVendorSelect(materialIndex, storeIndex)}
                        className={`p-3 rounded-md border relative transition-all cursor-pointer ${
                          isSelected && store.inStock
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : store.inStock
                              ? "border-green-200 bg-green-50 hover:border-blue-300 hover:bg-blue-25"
                              : "border-red-200 bg-red-50 opacity-75 cursor-not-allowed"
                        }`}
                      >
                        {isSelected && store.inStock && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="font-medium">{store.name}</span>
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              store.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {store.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900 mt-1">${store.price.toFixed(2)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Selected Total Cost:</span>
              <span className="text-2xl font-bold text-green-600">${calculatedTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Spaces
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
