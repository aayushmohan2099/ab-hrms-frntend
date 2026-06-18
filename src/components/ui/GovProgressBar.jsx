// src/components/ui/GovProgressBar.jsx
import { cn } from "../../utils/cn";

export function GovProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  variant = "primary",
  size = "md",
  className,
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const bgVariants = {
    primary: "bg-primary-dark",
    success: "bg-green-500",
    warning: "bg-orange-500",
    danger: "bg-danger",
    neutral: "bg-gray-500",
  };

  const heightVariants = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-sm">
          {label && (
            <span className="font-semibold text-gray-700">{label}</span>
          )}
          {showValue && (
            <span className="font-medium text-gray-600">
              {value} / {max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          heightVariants[size],
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            bgVariants[variant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
