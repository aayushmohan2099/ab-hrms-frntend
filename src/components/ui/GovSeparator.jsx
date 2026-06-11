// src/components/ui/GovSeparator.jsx
import { cn } from "../../utils/cn";

export function GovSeparator({ orientation = "horizontal", className }) {
  return (
    <div
      role="separator"
      className={cn(
        "bg-gray-200",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
    />
  );
}
