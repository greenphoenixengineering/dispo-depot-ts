import Link from "next/link"
import { Check } from "lucide-react"
import ButtonSignin from "./ButtonSignin"
import { PricingComparison } from "./PricingComparison"
import { PricingFAQ } from "./PricingFaq"

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

export function Pricing() {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg md:text-xl text-gray-600">
            Choose the plan that&apos;s right for your wholesale business. No hidden fees or long-term contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="border border-gray-200 rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-gray-600 mb-4">Perfect for getting started</p>
            <p className="text-3xl md:text-4xl font-bold mb-6">
              $0<span className="text-lg text-gray-500">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>10 buyers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>1 email by tag/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Basic buyer management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Email support</span>
              </li>
            </ul>
            <ButtonSignin extraStyle="block w-full py-2 text-center border border-black rounded-md hover:bg-gray-50 transition-colors" text="Get Started" />
          </div>

          {/* Standard Plan */}
          <div className="border-2 border-green-500 rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow relative">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <h3 className="text-xl font-semibold mb-2">Standard</h3>
            <p className="text-gray-600 mb-4">For growing businesses</p>
            <p className="text-3xl md:text-4xl font-bold mb-6">
              $9<span className="text-lg text-gray-500">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>500 buyers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>100 emails by tag/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Advanced buyer management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Priority email support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>CSV/Excel import</span>
              </li>
            </ul>
            <Link
              href="https://buy.stripe.com/cNibJ1daFb06b7r11ybZe02"
              className="block w-full py-2 text-center bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="border border-gray-200 rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-gray-600 mb-4">For power users</p>
            <p className="text-3xl md:text-4xl font-bold mb-6">
              $19<span className="text-lg text-gray-500">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Unlimited buyers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Unlimited emails</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Priority phone support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Custom integrations</span>
              </li>
            </ul>
            <Link
              href="https://buy.stripe.com/28EcN5eeJeci8Zj11ybZe03"
              className="block w-full py-2 text-center border border-black rounded-md hover:bg-gray-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
