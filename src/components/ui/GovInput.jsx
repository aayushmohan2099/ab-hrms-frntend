// src/components/ui/GovInput.jsx
import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const GovInput = forwardRef(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-semibold text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full px-3 py-2 bg-base border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-dark focus:border-primary-dark transition-colors",
            error && "border-danger focus:ring-danger focus:border-danger",
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    );
  }
);

GovInput.displayName = "GovInput";
