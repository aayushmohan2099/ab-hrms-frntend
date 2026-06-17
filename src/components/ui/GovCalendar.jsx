// src/components/ui/GovCalendar.jsx
import { cn } from "../../utils/cn";

export function GovCalendarCell({
  date,
  reason,
  variant = "neutral",
  className,
  onClick, // Allow cell clicking for interaction
}) {
  if (!date) {
    return (
      <td
        className={cn(
          "border border-gray-200 p-2 h-24 sm:h-32 bg-gray-50/50",
          className,
        )}
      />
    );
  }

  // Intercept the reason to override text and dynamically map specific leave colors
  let effectiveVariant = variant;
  let displayReason = reason;

  if (reason) {
    const upperReason = reason.toUpperCase();

    // 1. Display HOLIDAY instead of WEEKEND
    if (upperReason === "WEEKEND") {
      displayReason = "HOLIDAY";
    }

    // 2. Specific colors for different Leave types
    if (upperReason.includes("CASUAL")) {
      effectiveVariant = "leave_casual";
    } else if (upperReason.includes("SICK")) {
      effectiveVariant = "leave_sick";
    } else if (upperReason.includes("MATERNITY")) {
      effectiveVariant = "leave_maternity";
    }
  }

  const cellVariants = {
    neutral: "text-gray-700 hover:bg-gray-50",
    success: "bg-green-50 text-green-700 border-green-200", // Green for Present
    warning: "bg-orange-50 text-orange-700 border-orange-200",
    danger: "bg-red-50 text-red-700 border-red-200", // Red for Absent
    primary: "bg-gray-800 text-white border-gray-800",
    weekend: "bg-[#322382]/10 text-[#322382] border-[#322382]/30", // Custom Blue for Weekends/Holidays
    leave_casual: "bg-yellow-50 text-yellow-700 border-yellow-200", // Yellow for Casual
    leave_sick: "bg-indigo-50 text-indigo-700 border-indigo-200", // Indigo/Blue for Sick
    leave_maternity: "bg-pink-50 text-pink-700 border-pink-200", // Pink for Maternity
  };

  const labelVariants = {
    neutral: "bg-gray-200 text-gray-700",
    success: "bg-green-200 text-green-800", // Green for Present
    warning: "bg-orange-200 text-orange-900",
    danger: "bg-red-600 text-white", // Red for Absent
    primary: "bg-gray-900 text-gray-100",
    weekend: "bg-[#322382] text-white", // Custom Blue for Weekends/Holidays
    leave_casual: "bg-yellow-400 text-yellow-900",
    leave_sick: "bg-indigo-600 text-white",
    leave_maternity: "bg-pink-600 text-white",
  };

  return (
    <td
      onClick={onClick}
      className={cn(
        "border border-gray-200 relative text-center h-24 sm:h-32 text-3xl sm:text-5xl font-bold transition-colors",
        onClick ? "cursor-pointer" : "",
        cellVariants[effectiveVariant],
        className,
      )}
    >
      <span>{date}</span>
      {displayReason && (
        <span
          className={cn(
            "absolute bottom-0 left-0 w-full block text-[10px] sm:text-xs font-medium uppercase py-1 px-1 truncate",
            labelVariants[effectiveVariant],
          )}
          title={displayReason}
        >
          {displayReason}
        </span>
      )}
    </td>
  );
}

export function GovCalendar({
  month = "March",
  year,
  weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weeks = [],
  className,
  onCellClick, // Pass click handler to table
  ...props
}) {
  return (
    <div
      className={cn(
        "w-full max-w-6xl mx-auto bg-base border-2 border-gray-200 rounded-md shadow-sm overflow-hidden",
        className,
      )}
      {...props}
    >
      <table className="w-full table-fixed border-collapse">
        <caption className="border-b border-gray-200 bg-gray-50 p-4 sm:p-6 text-center">
          <h2 className="inline-block bg-gray-900 text-white text-2xl sm:text-4xl font-bold tracking-[0.1em] px-6 sm:px-8 py-2 uppercase rounded-sm shadow-md">
            {month} {year && <span className="text-gray-400 ml-2">{year}</span>}
          </h2>
        </caption>
        <thead>
          <tr>
            {weekDays.map((day, idx) => (
              <th
                key={idx}
                className="border border-gray-200 py-3 text-xs sm:text-sm tracking-[0.1em] uppercase text-gray-600 bg-gray-100"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIdx) => (
            <tr key={weekIdx}>
              {week.map((dayObj, dayIdx) => (
                <GovCalendarCell
                  key={`${weekIdx}-${dayIdx}`}
                  date={dayObj?.date}
                  reason={dayObj?.reason}
                  variant={dayObj?.variant || "neutral"}
                  onClick={() => onCellClick && dayObj && onCellClick(dayObj)} // Click execution
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
