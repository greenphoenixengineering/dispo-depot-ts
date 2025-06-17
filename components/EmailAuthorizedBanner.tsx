import { AlertTriangle } from "lucide-react";
import React from "react";

const EmailAuthorizedBanner = () => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Your email is being authorized, which takes a few days. You will
            receive an email once it is fully authorized.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailAuthorizedBanner;
