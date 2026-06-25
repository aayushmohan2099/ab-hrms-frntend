// src/components/ui/GovInput.jsx
import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

export const GovInput = forwardRef(
  (
    { label, error, className, id, type, showPasswordToggle = false, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={inputType}
            className={cn(
              "w-full px-3 py-2 bg-base border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-dark focus:border-primary-dark transition-colors",
              showPasswordToggle && "pr-10",
              error && "border-danger focus:ring-danger focus:border-danger",
              className,
            )}
            {...props}
          />

          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-primary-dark"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    );
  },
);

GovInput.displayName = "GovInput";
