import { Check, Zap, Crown } from 'lucide-react';

export const plans = [
  {
    name: 'Free',
    icon: <span className="text-lg">☆</span>,
    description: 'Perfect for getting started',
    price: 0,
    features: [
      '10 Buyers',
      '10 Emails/month',
      'Basic Buyer/Tag management',
    ],
    button: <button className="w-full bg-gray-100 text-gray-400 font-semibold rounded-md py-2 mt-4 cursor-default" disabled>Current Plan</button>,
    highlight: false,
  },
  {
    name: 'Standard',
    icon: <Zap className="w-5 h-5 inline-block text-green-600" />,
    description: 'For growing businesses',
    price: 9,
    features: [
      'Everything in Free plus:',
      '500 Buyers',
      '5000 Emails/month',      
      'Buyer CSV/Excel Import',
      'AI Deal Analyzer',
    ],
    button: <button className="w-full bg-green-500 text-white font-semibold rounded-md py-2 mt-4 hover:bg-green-600 transition">Upgrade to Standard</button>,
    highlight: true,
    badge: 'POPULAR',
  },
  {
    name: 'Pro',
    icon: <Crown className="w-5 h-5 inline-block text-gray-700" />,
    description: 'For power users',
    price: 19,
    features: [
      'Everything in Standard plus:',
      'Unlimited Buyers',
      'Unlimited Emails',      
      'AI Deal Email Generator',
      'Enhanced Email Automations',
    ],
    button: <button className="w-full bg-gray-100 text-gray-700 font-semibold rounded-md py-2 mt-4 hover:bg-gray-200 transition">Upgrade to Pro</button>,
    highlight: false,
  },
];

const AvailablePlans = () => (
  <section className="mb-10">
    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Available Plans</h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {plans.map((plan, idx) => (
        <div
          key={plan.name}
          className={`relative bg-white rounded-xl border ${plan.highlight ? 'border-2 border-green-500 shadow-lg' : 'border-gray-200'} p-6 flex flex-col items-start min-h-[420px]`}
        >
          {plan.badge && (
            <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</span>
          )}
          <div className={`mb-2 text-2xl font-bold text-gray-900 flex items-center gap-2 ${plan.badge ? 'mt-6' : ''}`}>
            {plan.icon}
            {plan.name}
          </div>
          <div className="text-gray-500 mb-4 font-medium">{plan.description}</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">${plan.price}<span className="text-base font-medium text-gray-500">/month</span></div>
          <ul className="mt-3 mb-2 space-y-2 text-gray-800 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex-1" />
          {plan.button}
        </div>
      ))}
    </div>
  </section>
);

export default AvailablePlans; 