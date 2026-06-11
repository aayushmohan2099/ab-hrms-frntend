import { cn } from "../../utils/cn";

export function GovCard({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "bg-base border border-gray-200 rounded-md shadow-sm p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
