//  src/components/ui/GovStatCard.jsx
import { cn } from "../../utils/cn";
import { GovCard } from "./GovCard";

export function GovStatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = "neutral",
  className,
}) {
  const iconBgVariants = {
    neutral: "bg-gray-100 text-gray-600",
    primary: "bg-blue-100 text-primary-dark",
    success: "bg-green-100 text-green-600",
    warning: "bg-orange-100 text-orange-600",
    danger: "bg-red-100 text-danger",
  };

  const trendVariants = {
    up: "text-green-600",
    down: "text-danger",
    neutral: "text-gray-500",
  };

  return (
    <GovCard className={cn("flex items-center p-6 gap-4", className)}>
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
          iconBgVariants[variant],
        )}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide truncate">
          {title}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
            {value}
          </h3>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium ml-2",
                trend.startsWith("+")
                  ? trendVariants.up
                  : trend.startsWith("-")
                    ? trendVariants.down
                    : trendVariants.neutral,
              )}
            >
              {trend} {trendLabel}
            </span>
          )}
        </div>
      </div>
    </GovCard>
  );
}
