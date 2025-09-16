"use client"

import { useState, useEffect } from "react"
import { Search, Wrench, Calculator } from "lucide-react"

export function AIAnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: Search,
      title: "AI Space Analysis",
      description: "Analyzing repair requirements and materials",
    },
    {
      icon: Wrench,
      title: "Material Sourcing",
      description: "Finding best prices at local hardware stores",
    },
    {
      icon: Calculator,
      title: "Cost Calculation",
      description: "Calculating total material costs and estimates",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Spaces</h2>
          <p className="text-gray-600">Our AI is working hard to get you the best estimates</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <div
                key={index}
                className={`flex items-center p-4 rounded-lg transition-all duration-500 ${
                  isActive
                    ? "bg-green-50 border-2 border-green-200 scale-105"
                    : isCompleted
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-gray-50 border border-gray-200 opacity-50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-colors ${
                    isActive
                      ? "bg-green-500 text-white"
                      : isCompleted
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3
                    className={`font-semibold ${
                      isActive ? "text-green-800" : isCompleted ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isActive ? "text-green-600" : isCompleted ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
