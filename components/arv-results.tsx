"use client"

import { useState, useEffect } from "react"
import { CheckCircle, ArrowLeft, Send } from "lucide-react"

interface ARVResultsProps {
  address: string
  arv: number
  repairCosts: number
  onNext: () => void
  onBack: () => void
}

export function ARVResults({ address, arv, repairCosts, onNext, onBack }: ARVResultsProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [laborCosts, setLaborCosts] = useState(0) // Added local state for labor costs
  const totalRepairCosts = repairCosts + laborCosts
  const mao = Math.round(arv * 0.7 - totalRepairCosts)

  useEffect(() => {
    // Trigger confetti animation on mount
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Analysis Complete!</h2>
        </div>
        <p className="text-gray-600">Property: {address}</p>
      </div>

      {/* ARV Display */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">After Repair Value (ARV)</h3>
          <div className="text-6xl font-bold text-blue-600 mb-2">${arv.toLocaleString()}</div>
          <p className="text-gray-600">Based on comparable properties in the area</p>
        </div>

        {/* Calculation Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Maximum Allowable Offer (MAO)</h4>
          <div className="space-y-3 text-left max-w-md mx-auto">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ARV</span>
              <span className="font-semibold">${arv.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">× 70% Rule</span>
              <span className="font-semibold">${Math.round(arv * 0.7).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">- Material Costs</span>
              <span className="font-semibold text-red-600">-${repairCosts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">- Labor Costs</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  value={laborCosts || ""}
                  onChange={(e) => setLaborCosts(Number(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
                />
              </div>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Maximum Allowable Offer</span>
              <span className="text-2xl font-bold text-green-600">${mao.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNext}
          className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold inline-flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send Deal To Buyers
        </button>
      </div>

      {/* Back Button */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Property Information
        </button>
      </div>
    </div>
  )
}
