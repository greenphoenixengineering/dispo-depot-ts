import Link from "next/link";
import { Check } from "lucide-react";
import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";
import SubscriptionManager from "./SubscriptionManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { PlanName } from "@/types/config";
import { getPlanOperation } from "@/libs/stripe";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

export async function Pricing() {
  const session = await getServerSession(authOptions);
  const currentPlanName = session?.user?.plan?.name || PlanName.FREE;

  return (
    <section className="py-12 md:py-24" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Choose the plan that&apos;s right for your wholesale business. No
            hidden fees or long-term contracts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {config.stripe.plans.map((plan) => {
            const operation = getPlanOperation(currentPlanName, plan.name);
            const isCurrentPlan = currentPlanName === plan.name;
            
            return (
              <div
                key={plan.priceId}
                className={`bg-white rounded-lg border-2 p-6 md:p-8 ${
                  plan.isFeatured
                    ? "border-green-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl md:text-4xl font-bold">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                  {plan.priceAnchor && (
                    <p className="text-sm text-gray-500 line-through">
                      ${plan.priceAnchor}/month
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature.name}</span>
                    </li>
                  ))}
                </ul>

                {session ? (
                  isCurrentPlan ? (
                    <div className="text-center">
                      <span className="inline-block w-full py-2 text-center rounded-md bg-gray-100 text-gray-600 cursor-not-allowed">
                        Current Plan
                      </span>
                    </div>
                  ) : (
                    <SubscriptionManager
                      priceId={plan.priceId}
                      operation={operation}
                      className={`block w-full py-2 text-center rounded-md transition-colors ${
                        plan.isFeatured
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "border border-black hover:bg-gray-50"
                      }`}
                    >
                      {operation === 'upgrade' && 'Upgrade'}
                      {operation === 'downgrade' && 'Downgrade'}
                      {operation === 'new' && 'Get Started'}
                    </SubscriptionManager>
                  )
                ) : (
                  <Link
                    href={`${
                      config.auth.loginUrl
                    }?callbackUrl`}
                    className={`block w-full py-2 text-center rounded-md transition-colors ${
                      plan.isFeatured
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "border border-black hover:bg-gray-50"
                    }`}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
