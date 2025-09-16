"use client"

import { useState, useEffect } from "react"
import { Home, Search, Calculator, TrendingUp } from "lucide-react"

export function ARVLoading() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { icon: Home, label: "Analyzing Property" },
    { icon: Search, label: "Finding Comparables" },
    { icon: Calculator, label: "Calculating ARV" },
    { icon: TrendingUp, label: "Generating Report" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 1000)

    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculating After Repair Value</h2>
        <p className="text-gray-600">Our AI is analyzing comparable properties and market data...</p>
      </div>

      <div className="flex justify-center items-center space-x-8 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                  isActive
                    ? "bg-blue-500 text-white scale-110 shadow-lg"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                <Icon className={`w-8 h-8 ${isActive ? "animate-pulse" : ""}`} />
              </div>
              <p
                className={`text-sm font-medium transition-colors duration-300 ${
                  isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          )
        })}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
