import { Check, X } from "lucide-react"

export function PricingComparison() {
  return (
    <div className="py-12 md:py-24 bg-gray-100">
      <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">Feature Comparison</h2>
      <div className="flex justify-center">
        <div className="w-full lg:w-1/2 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 md:py-4 px-4 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Free
                </th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Standard
                </th>
                <th className="py-3 md:py-4 px-4 md:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm font-medium text-gray-900">Buyers</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-500 text-center">10</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-500 text-center">500</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-500 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm font-medium text-gray-900">Emails per month</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-500 text-center">10</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-500 text-center">5000</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm text-gray-500 text-center">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm font-medium text-gray-900">Buyer/Tag Management</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm font-medium text-gray-900">CSV/Excel Import</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm font-medium text-gray-900">AI Deal Analyzer</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm font-medium text-gray-900">AI Deal Email Generator</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 md:py-4 px-4 md:px-6 text-sm font-medium text-gray-900">Enhanced Email Automations</td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}