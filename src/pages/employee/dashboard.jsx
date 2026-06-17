// src/pages/employee/dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { attendanceService } from "../../api/attendanceService";
import { GovCalendar } from "../../components/ui/GovCalendar";
import { GovSelect } from "../../components/ui/GovSelect";
import { GovCard } from "../../components/ui/GovCard";

export function EmployeeDashboard() {
  const { user } = useAuth();

  // Selection State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Data State
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Generate valid years (From 2026 onwards)
  const currentYear = new Date().getFullYear();
  const validYears = [];
  for (let y = 2026; y <= Math.max(2026, currentYear); y++) {
    validYears.push(y);
  }

  // Generate valid months based on selected year (Not before June 2026)
  const validMonths = monthNames.map((name, index) => ({
    value: index + 1,
    label: name,
  }));

  const getFilteredMonths = () => {
    if (selectedYear == 2026) {
      return validMonths.filter((m) => m.value >= 6); // June onwards for 2026
    }
    return validMonths;
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      // Need user's department to use the department monthly endpoint
      // We assume user context has department_id. If not, the API endpoint needs adjusting.
      const deptId = user?.department_id;
      const empCode = user?.username; // Username acts as the employee code

      if (!deptId || !empCode) {
        setError(
          "User profile context incomplete. Missing department mapping.",
        );
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await attendanceService.getDepartmentMonthlyAttendance(
          deptId,
          selectedMonth,
          selectedYear,
        );

        // Find the logged-in employee's specific record from the department payload
        const myRecord = data.find((emp) => emp.employee_code === empCode);
        const records = myRecord ? myRecord.daily_records : [];

        // Build the calendar grid
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const firstDayIndex = new Date(
          selectedYear,
          selectedMonth - 1,
          1,
        ).getDay();

        let currentWeek = new Array(7).fill(null);
        const weeks = [];

        // Pad empty days at start of month
        for (let i = 0; i < firstDayIndex; i++) {
          currentWeek[i] = null;
        }

        // Fill actual days
        for (let day = 1; day <= daysInMonth; day++) {
          const dayIndex = (firstDayIndex + day - 1) % 7;

          const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dailyRecord = records.find((r) => r.date === dateStr);

          const currentStatus = dailyRecord?.status || "PENDING";

          let variant = "neutral";
          let displayReason = "";

          if (currentStatus === "PRESENT") {
            variant = "success";
            displayReason = "Present";
          } else if (currentStatus === "ABSENT") {
            variant = "danger";
            displayReason = "Absent";
          } else if (
            currentStatus === "WEEKEND" ||
            currentStatus === "HOLIDAY"
          ) {
            variant = "primary";
            displayReason = currentStatus;
          } else if (currentStatus.includes("LEAVE")) {
            variant = "success";
            displayReason = currentStatus.replace("_", " ");
          }

          currentWeek[dayIndex] = {
            date: day,
            fullDate: dateStr,
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
      } catch (err) {
        console.error("Failed to fetch personal attendance:", err);
        setError("Unable to load your attendance data at this time.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAttendance();
    }
  }, [user, selectedMonth, selectedYear]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Attendance</h2>
          <p className="text-sm text-gray-500">
            View your daily presence record.
          </p>
        </div>
      </div>

      <GovCard className="bg-gray-50 flex gap-4 items-center">
        <div className="w-48">
          <GovSelect
            label="Year"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(Number(e.target.value));
              if (Number(e.target.value) === 2026 && selectedMonth < 6)
                setSelectedMonth(6);
            }}
            options={validYears.map((y) => ({ value: y, label: y.toString() }))}
          />
        </div>
        <div className="w-48">
          <GovSelect
            label="Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            options={getFilteredMonths()}
          />
        </div>
      </GovCard>

      {loading ? (
        <div className="p-12 text-center text-gray-500">
          Loading your calendar...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-danger font-medium">{error}</div>
      ) : (
        <GovCalendar
          month={monthNames[selectedMonth - 1]}
          year={selectedYear}
          weeks={calendarWeeks}
          // Intentionally omitting onCellClick as this is view-only for the employee
        />
      )}
    </div>
  );
}
