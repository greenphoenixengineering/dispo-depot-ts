"use client";

import { useFeatureGuard } from "@/libs/hooks/useFeatureGuard";
import { FeatureGate } from "./FeatureGate";
import { UpgradePrompt } from "./UpgradePrompt";
import { FileSpreadsheet, BarChart3, Code, Smartphone } from "lucide-react";

export function PlanBasedFeatureShowcase() {
  const { featureGuard, loading } = useFeatureGuard();

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>;
  }

  const features = [
    {
      id: 'csvImport' as const,
      name: 'CSV/Excel Import',
      description: 'Import buyers in bulk from spreadsheets',
      icon: <FileSpreadsheet className="w-6 h-6" />,
      availableInPlan: 'Standard'
    },
    {
      id: 'advancedAnalytics' as const,
      name: 'Advanced Analytics',
      description: 'Detailed insights and reporting',
      icon: <BarChart3 className="w-6 h-6" />,
      availableInPlan: 'Pro'
    },
    {
      id: 'apiAccess' as const,
      name: 'API Access',
      description: 'Integrate with your existing tools',
      icon: <Code className="w-6 h-6" />,
      availableInPlan: 'Pro'
    },
    {
      id: 'customIntegrations' as const,
      name: 'Custom Integrations',
      description: 'Build custom workflows and automations',
      icon: <Smartphone className="w-6 h-6" />,
      availableInPlan: 'Pro'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature) => (
        <FeatureGate
          key={feature.id}
          feature={feature.id}
          showUpgradePrompt={false}
          fallback={
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75">
              <div className="flex items-start gap-3">
                <div className="text-gray-400 mt-1">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-600 mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {feature.description}
                  </p>
                  <span className="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    Available in {feature.availableInPlan}
                  </span>
                </div>
              </div>
            </div>
          }
        >
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-start gap-3">
              <div className="text-green-600 mt-1">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-800 mb-1">
                  {feature.name}
                </h3>
                <p className="text-sm text-green-700 mb-2">
                  {feature.description}
                </p>
                <span className="inline-block text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                  ✓ Available
                </span>
              </div>
            </div>
          </div>
        </FeatureGate>
      ))}
    </div>
  );
}
