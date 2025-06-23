import Link from "next/link"
import { Check } from "lucide-react"
import ButtonSignin from "./ButtonSignin"
import { PricingComparison } from "./PricingComparison"
import { PricingFAQ } from "./PricingFaq"
import config from "@/config"

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

        <div className={`grid grid-cols-1 md:grid-cols-${config.stripe.plans.length} gap-8 max-w-5xl mx-auto`}>
          {config.stripe.plans.map((plan, index) => (
            <div 
              key={plan.priceId}
              className={`border rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow relative ${
                plan.isFeatured 
                  ? 'border-2 border-green-500' 
                  : 'border-gray-200'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              
              <div className="mb-6">
                <p className="text-3xl md:text-4xl font-bold">
                  ${plan.price}<span className="text-lg text-gray-500">/month</span>
                </p>
                {plan.priceAnchor && (
                  <p className="text-lg text-gray-500 line-through">
                    ${plan.priceAnchor}/month
                  </p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
              
              {plan.priceId ? (
                <Link
                  href={`https://buy.stripe.com/${plan.priceId}`}
                  className={`block w-full py-2 text-center rounded-md transition-colors ${
                    plan.isFeatured
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'border border-black hover:bg-gray-50'
                  }`}
                >
                  Get Started
                </Link>
              ) : (
                <ButtonSignin 
                  extraStyle={`block w-full py-2 text-center border border-black rounded-md hover:bg-gray-50 transition-colors ${
                    plan.isFeatured ? 'bg-green-500 text-white hover:bg-green-600 border-green-500' : ''
                  }`} 
                  text="Get Started" 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
