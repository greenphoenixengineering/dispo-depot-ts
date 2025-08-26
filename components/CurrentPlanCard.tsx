"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { PlanName } from "@/types/config";
import SubscriptionManager from "./SubscriptionManager";
import { getPlanOperation } from "@/libs/stripe";
import config from "@/config";

const CurrentPlanCard = () => {
  const { data: session } = useSession();
  
  if (!session?.user?.plan) {
    return null;
  }

  const currentPlan = session.user.plan;
  const currentPlanConfig = config.stripe.plans.find(p => p.name === currentPlan.name);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Current Plan</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          currentPlan.hasAccess 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {currentPlan.hasAccess ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="mb-4">
        <h4 className="text-xl font-bold text-gray-900">{currentPlan.name}</h4>
        {currentPlanConfig && (
          <p className="text-gray-600">{currentPlanConfig.description}</p>
        )}
      </div>

      {currentPlanConfig && (
        <div className="mb-6">
          <div className="text-2xl font-bold text-gray-900">
            ${currentPlanConfig.price}
            {currentPlanConfig.price > 0 && <span className="text-sm text-gray-500">/month</span>}
          </div>
          
          <ul className="mt-3 space-y-2">
            {currentPlanConfig.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        {config.stripe.plans
          .filter(plan => plan.name !== currentPlan.name)
          .map(plan => {
            const operation = getPlanOperation(currentPlan.name, plan.name);
            
            return (
              <SubscriptionManager
                key={plan.priceId}
                priceId={plan.priceId}
                operation={operation}
                className="w-full py-2 px-4 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {operation === 'upgrade' && `Upgrade to ${plan.name}`}
                {operation === 'downgrade' && `Downgrade to ${plan.name}`}
                {operation === 'new' && `Switch to ${plan.name}`}
              </SubscriptionManager>
            );
          })}
      </div>
    </div>
  );
};

export default CurrentPlanCard; 