"use client"

export function PropertyDataLoading() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
      <div className="text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Scraping Property Data</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">Gathering property information from our database...</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse" />
        </div>
        
        <p className="text-xs sm:text-sm text-gray-500 mt-4">
          This usually takes 10-30 seconds depending on property complexity
        </p>
      </div>
    </div>
  )
}
