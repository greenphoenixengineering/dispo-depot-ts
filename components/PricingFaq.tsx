export function PricingFAQ() {
  return (
    <div className="mt-12 md:mt-16">
      <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-2">Can I upgrade or downgrade my plan at any time?</h3>
          <p className="text-gray-600">
            Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing
            cycle.
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-2">What happens if I exceed my plan limits?</h3>
          <p className="text-gray-600">
            We&apos;ll notify you when you&apos;re approaching your plan limits. If you exceed them, you&apos;ll have the option to
            upgrade to a higher tier or wait until the next billing cycle.
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-2">Do you offer annual billing?</h3>
          <p className="text-gray-600">
            Yes, we offer annual billing with a 10% discount. Contact our sales team to switch to annual billing.
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-2">Is there a contract or commitment?</h3>
          <p className="text-gray-600">
            No, all plans are month-to-month with no long-term commitment. You can cancel at any time.
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-2">Do you offer a free trial?</h3>
          <p className="text-gray-600">
            Our Free plan serves as an unlimited trial. You can use it for as long as you like and upgrade when you need
            more features.
          </p>
        </div>
      </div>
    </div>
  )
}
