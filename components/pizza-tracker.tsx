"use client"

interface PizzaTrackerProps {
  currentStep: number
  steps: string[]
}

export function PizzaTracker({ currentStep, steps }: PizzaTrackerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
      <div className="flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-1 sm:mt-2 text-xs font-medium text-center max-w-16 sm:max-w-20 ${
                  index <= currentStep ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 lg:w-16 h-0.5 mx-2 sm:mx-3 lg:mx-4 transition-colors ${index < currentStep ? "bg-green-500" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
