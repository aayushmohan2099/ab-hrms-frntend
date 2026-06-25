// src/pages/admin/AttenComps/EmployeeCalendar.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { attendanceService } from "../../../api/attendanceService";
import { GovCalendar } from "../../../components/ui/GovCalendar";
import { GovButton } from "../../../components/ui/GovButton";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export function EmployeeCalendar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely grab state passed from the list page
  const {
    empCode,
    month: initialMonth,
    year: initialYear,
    records: initialRecords,
    name,
  } = location.state || {};

  // <-- Convert router state into manageable local state for navigation
  const [currentMonth, setCurrentMonth] = useState(
    initialMonth || new Date().getMonth() + 1,
  );
  const [currentYear, setCurrentYear] = useState(
    initialYear || new Date().getFullYear(),
  );
  const [currentRecords, setCurrentRecords] = useState(initialRecords || []);
  const [isFetchingMonth, setIsFetchingMonth] = useState(false); // loader for month switching

  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [modifiedDates, setModifiedDates] = useState({}); // Track which dates the user manually toggled
  const [saving, setSaving] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // <-- Function to handle changing months
  const handleMonthChange = async (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setIsFetchingMonth(true);

    try {
      // NOTE: Ensure your attendanceService has this method or adapt the name (e.g., getAttendanceByEmployee)
      const data = await attendanceService.getEmployeeAttendance(
        empCode,
        newYear,
        newMonth,
      );
      setCurrentRecords(data || []);
      setModifiedDates({}); // Clear tracking when leaving month
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      alert("Failed to load attendance for the selected month.");
      setCurrentRecords([]);
    } finally {
      setIsFetchingMonth(false);
    }
  };

  useEffect(() => {
    if (!empCode) {
      navigate("/admin/attendance");
      return;
    }

    // Build the calendar grid using CURRENT state variables
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();

    let currentWeek = new Array(7).fill(null);
    const weeks = [];

    // Pad empty days at start of month
    for (let i = 0; i < firstDayIndex; i++) {
      currentWeek[i] = null;
    }

    // Fill actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayIndex = (firstDayIndex + day - 1) % 7;

      // Find backend record for this date
      // Formatting date strictly to YYYY-MM-DD
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const record = currentRecords.find((r) => r.date === dateStr);

      // Default to what backend says, but override if user modified it in UI
      const currentStatus =
        modifiedDates[dateStr] || record?.status || "PENDING";

      let variant = "neutral";
      let displayReason = "";

      if (currentStatus === "PRESENT") {
        variant = "success";
        displayReason = "Present";
      } else if (currentStatus === "ABSENT") {
        variant = "danger";
        displayReason = "Absent";
      } else if (currentStatus === "WEEKEND" || currentStatus === "HOLIDAY") {
        variant = "weekend";
        displayReason = currentStatus;
      } else if (currentStatus.includes("LEAVE")) {
        variant = "success";
        displayReason = currentStatus.replace("_", " ");
      }

      currentWeek[dayIndex] = {
        date: day,
        fullDate: dateStr,
        originalStatus: record?.status,
        currentStatus: currentStatus,
        isLocked: record?.is_locked, // E.g. approved leave or previous manual override
        variant: variant,
        reason: displayReason,
      };

      // Push week to array if it's Saturday or last day
      if (dayIndex === 6 || day === daysInMonth) {
        weeks.push([...currentWeek]);
        currentWeek = new Array(7).fill(null);
      }
    }

    setCalendarWeeks(weeks);
  }, [
    empCode,
    currentMonth,
    currentYear,
    currentRecords,
    modifiedDates,
    navigate,
  ]);

  const handleCellClick = (dayObj) => {
    // Only allow toggling if it's a standard Present/Absent day and NOT locked by a manager/leave
    if (!dayObj || dayObj.isLocked) return;
    if (
      dayObj.originalStatus === "WEEKEND" ||
      dayObj.originalStatus === "HOLIDAY" ||
      dayObj.originalStatus?.includes("LEAVE")
    )
      return;

    const newStatus = dayObj.currentStatus === "PRESENT" ? "ABSENT" : "PRESENT";

    setModifiedDates((prev) => ({
      ...prev,
      [dayObj.fullDate]: newStatus,
    }));
  };

  const handleSave = async () => {
    const datesToUpdate = Object.keys(modifiedDates).filter(
      (date) => modifiedDates[date] === "ABSENT",
    );

    if (datesToUpdate.length === 0) {
      alert("No new absences marked to save.");
      return;
    }

    setSaving(true);
    try {
      // Send sequential requests (in a real scenario, building a bulk mark-absent endpoint is better)
      for (const date of datesToUpdate) {
        await attendanceService.markAbsent(empCode, date);
      }
      alert("Absences saved successfully. Return to list to refresh data.");
      setModifiedDates({}); // Clear tracking
    } catch (err) {
      alert("Failed to save some absences.");
    } finally {
      setSaving(false);
    }
  };

  if (!empCode) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/attendance")}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
            <p className="text-sm font-mono text-gray-500">{empCode}</p>
          </div>
        </div>
        <GovButton
          variant="danger"
          className="gap-2"
          onClick={handleSave}
          disabled={saving || Object.keys(modifiedDates).length === 0}
        >
          <Save size={16} /> {saving ? "Saving..." : "Save Absences"}
        </GovButton>
      </div>

      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-100">
        <strong>Instructions:</strong> Click on any "PRESENT" cell to manually
        mark the employee as "ABSENT". Locked days (Weekends, Approved Leaves)
        cannot be modified here.
      </p>

      {/* Wrapping Calendar in a relative div to allow the loader overlay if needed */}
      <div className="relative">
        {isFetchingMonth && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-md">
            <div className="flex flex-col items-center text-primary-dark">
              <Loader2 className="animate-spin mb-2" size={32} />
              <span className="font-semibold text-sm">
                Loading attendance...
              </span>
            </div>
          </div>
        )}
        <GovCalendar
          month={monthNames[currentMonth - 1]}
          year={currentYear}
          weeks={calendarWeeks}
          onCellClick={handleCellClick}
          onPrevMonth={() => handleMonthChange(-1)} // <-- Attach prev handler
          onNextMonth={() => handleMonthChange(1)} // <-- Attach next handler
        />
      </div>
    </div>
  );
}
