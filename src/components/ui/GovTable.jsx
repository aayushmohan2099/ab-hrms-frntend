// src/components/ui/GovTable.jsx
import { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

export function GovTable({ children, className }) {
  const topScrollbarRef = useRef(null);
  const bottomScrollbarRef = useRef(null);
  const topContentRef = useRef(null);

  useEffect(() => {
    const top = topScrollbarRef.current;
    const bottom = bottomScrollbarRef.current;
    const content = topContentRef.current;

    if (!top || !bottom || !content) return;

    const updateWidth = () => {
      content.style.width = `${bottom.scrollWidth}px`;
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(bottom);

    const syncFromTop = () => {
      bottom.scrollLeft = top.scrollLeft;
    };

    const syncFromBottom = () => {
      top.scrollLeft = bottom.scrollLeft;
    };

    top.addEventListener("scroll", syncFromTop);
    bottom.addEventListener("scroll", syncFromBottom);

    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      top.removeEventListener("scroll", syncFromTop);
      bottom.removeEventListener("scroll", syncFromBottom);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Top Horizontal Scrollbar */}
      <div
        ref={topScrollbarRef}
        className="overflow-x-auto overflow-y-hidden mb-2"
      >
        <div ref={topContentRef} className="h-1"></div>
      </div>

      {/* Table */}
      <div
        ref={bottomScrollbarRef}
        className="overflow-x-auto border border-gray-200 rounded-md"
      >
        <table
          className={cn("w-full text-sm text-left text-gray-700", className)}
        >
          {children}
        </table>
      </div>
    </div>
  );
}

export function GovTableHeader({ children, className }) {
  return (
    <thead
      className={cn(
        "text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200",
        className,
      )}
    >
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
        className,
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
        className,
      )}
    >
      {children}
    </Component>
  );
}
