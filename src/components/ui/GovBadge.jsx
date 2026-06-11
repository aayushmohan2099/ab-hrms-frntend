import { cn } from "../../utils/cn";

export function GovBadge({ children, variant = "neutral", className }) {
  const variants = {
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-orange-50 text-orange-700 border-orange-200",
    danger: "bg-red-50 text-danger border-red-200",
    primary: "bg-blue-50 text-primary-dark border-blue-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
