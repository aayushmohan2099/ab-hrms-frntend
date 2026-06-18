// src/pages/admin/AttenComps/HolidayPattern.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../../../api/deptService";
import { attendanceService } from "../../../api/attendanceService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovButton } from "../../../components/ui/GovButton";
import { GovCalendar } from "../../../components/ui/GovCalendar";
import { ArrowLeft, Save, Calendar as CalendarIcon } from "lucide-react";

export function HolidayPattern() {
  const navigate = useNavigate();

  // Selection State
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(
    Math.min(Math.max(new Date().getFullYear(), 2025), 2029),
  );

  // Calendar & Action State
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Constants
  const validYears = [2025, 2026, 2027, 2028, 2029];
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
  const validMonths = monthNames.map((name, index) => ({
    value: index + 1,
    label: name,
  }));

  // Fetch Departments
  useEffect(() => {
    departmentService
      .getDepartments(1, 100)
      .then((data) => setDepartments(data.results || []));
  }, []);

  // Build Calendar Grid
  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayIndex = new Date(selectedYear, selectedMonth - 1, 1).getDay();

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

      // Determine variant based on user selection
      const isSelected = selectedHolidays.includes(dateStr);
      let variant = isSelected ? "primary" : "neutral";
      let reason = isSelected ? "HOLIDAY" : "";

      currentWeek[dayIndex] = {
        date: day,
        fullDate: dateStr,
        variant: variant,
        reason: reason,
      };

      // Push week to array if it's Saturday or last day
      if (dayIndex === 6 || day === daysInMonth) {
        weeks.push([...currentWeek]);
        currentWeek = new Array(7).fill(null);
      }
    }

    setCalendarWeeks(weeks);
  }, [selectedMonth, selectedYear, selectedHolidays]);

  // Handle Cell Click (Toggle Holiday Selection)
  const handleCellClick = (dayObj) => {
    if (!dayObj) return;

    setError(null);
    setSuccess(null);

    setSelectedHolidays((prev) => {
      if (prev.includes(dayObj.fullDate)) {
        // Remove if already selected
        return prev.filter((d) => d !== dayObj.fullDate);
      } else {
        // Add if not selected
        return [...prev, dayObj.fullDate];
      }
    });
  };

  const handleSaveHolidays = async () => {
    if (!selectedDept) {
      setError("Please select a department first.");
      return;
    }

    if (selectedHolidays.length === 0) {
      setError(
        "Please select at least one date on the calendar to mark as a holiday.",
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        department_id: parseInt(selectedDept, 10),
        dates: selectedHolidays,
      };

      const res = await attendanceService.bulkMarkHolidays(payload);
      setSuccess(res.detail || "Holidays marked successfully.");
      setSelectedHolidays([]); // Clear selection after successful save
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to mark holidays. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/attendance")}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Set Holiday Pattern
            </h2>
            <p className="text-sm text-gray-500">
              Bulk apply holidays to an entire department.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-1 space-y-6">
          <GovCard className="bg-blue-50 border-blue-200">
            <h3 className="font-bold text-primary-dark mb-4 flex items-center gap-2">
              <CalendarIcon size={18} /> Configuration
            </h3>

            <div className="space-y-4">
              <GovSelect
                label="Target Department"
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setError(null);
                }}
                options={[
                  { value: "", label: "-- Select Department --" },
                  ...departments.map((d) => ({
                    value: d.id,
                    label: `${d.code} - ${d.name}`,
                  })),
                ]}
              />

              <GovSelect
                label="Year"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  setSelectedHolidays([]); // Clear selection on month/year change
                }}
                options={validYears.map((y) => ({
                  value: y,
                  label: y.toString(),
                }))}
              />

              <GovSelect
                label="Month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(Number(e.target.value));
                  setSelectedHolidays([]); // Clear selection on month/year change
                }}
                options={validMonths}
              />
            </div>

            <div className="mt-8 pt-4 border-t border-blue-200">
              <div className="mb-4 text-sm">
                <span className="block font-semibold text-gray-700">
                  Selected Dates:
                </span>
                <span className="text-primary-dark font-bold text-lg">
                  {selectedHolidays.length}
                </span>
              </div>
              <GovButton
                variant="primary"
                className="w-full gap-2"
                disabled={
                  saving || selectedHolidays.length === 0 || !selectedDept
                }
                onClick={handleSaveHolidays}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Apply Holidays"}
              </GovButton>
            </div>
          </GovCard>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200 font-medium">
              {success}
            </div>
          )}
        </div>

        {/* Right Area: Calendar */}
        <div className="lg:col-span-3">
          <GovCard className="h-full">
            <div className="mb-4 bg-gray-50 p-3 rounded text-sm text-gray-600 border border-gray-200">
              <strong>Instructions:</strong> Click on any date below to toggle
              it as a department-wide holiday. Dates will appear highlighted in
              dark blue.
            </div>

            <GovCalendar
              month={monthNames[selectedMonth - 1]}
              year={selectedYear}
              weeks={calendarWeeks}
              onCellClick={handleCellClick}
            />
          </GovCard>
        </div>
      </div>
    </div>
  );
}
