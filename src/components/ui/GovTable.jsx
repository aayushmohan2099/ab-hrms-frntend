// src/components/ui/GovTable.jsx
import { cn } from "../../utils/cn";

export function GovTable({ children, className }) {
  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-md">
      <table className={cn("w-full text-sm text-left text-gray-700", className)}>
        {children}
      </table>
    </div>
  );
}

export function GovTableHeader({ children, className }) {
  return (
    <thead className={cn("text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200", className)}>
      <tr>{children}</tr>
    </thead>
  );
}

export function GovTableRow({ children, className, hover = true }) {
  return (
    <tr
      className={cn(
        "border-b border-gray-100 transition-colors",
        hover && "hover:bg-blue-50/50",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function GovTableCell({ children, className, isHeader = false }) {
  const Component = isHeader ? "th" : "td";
  return (
    <Component
      className={cn(
        "px-4 py-3 whitespace-nowrap",
        isHeader && "font-semibold tracking-wide",
        className
      )}
    >
      {children}
    </Component>
  );
}
