// src/components/ui/GovSelect.jsx
import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const GovSelect = forwardRef(
  ({ label, error, className, id, options = [], ...props }, ref) => {
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
        <select
          id={id}
          ref={ref}
          className={cn(
            "w-full px-3 py-2 bg-base border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary-dark focus:border-primary-dark transition-colors",
            error && "border-danger focus:ring-danger focus:border-danger",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    );
  }
);

GovSelect.displayName = "GovSelect";
