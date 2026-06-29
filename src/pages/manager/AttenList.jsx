// src/pages/manager/AttenList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../../api/deptService";
import { attendanceService } from "../../api/attendanceService";
import { GovCard } from "../../components/ui/GovCard";
import { GovSelect } from "../../components/ui/GovSelect";
import { GovButton } from "../../components/ui/GovButton";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import { Calendar, Upload, RefreshCw } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function AttenList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  // Selection State
  const [selectedDept, setSelectedDept] = useState(
    user?.department_id ? String(user.department_id) : "",
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(
    Math.min(Math.max(new Date().getFullYear(), 2025), 2029),
  );

  // Data State
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Years: 2025 - 2029
  const validYears = [2025, 2026, 2027, 2028, 2029];

  // All months selectable
  const validMonths = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    departmentService.getDepartments(1, 100).then((data) => {
      setDepartments(data.results || []);

      if (user?.department_id) {
        setSelectedDept(String(user.department_id));
      }
    });
  }, [user]);

  const fetchAttendance = async () => {
    if (!selectedDept || !selectedMonth || !selectedYear) return;

    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getDepartmentMonthlyAttendance(
        selectedDept,
        selectedMonth,
        selectedYear,
      );
      setAttendanceData(data || []);
    } catch (err) {
      setError("Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch automatically when filters change
  useEffect(() => {
    fetchAttendance();
  }, [selectedDept, selectedMonth, selectedYear]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Monthly Attendance
          </h2>
          <p className="text-sm text-gray-500">
            View and manage employee daily presence.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:ml-auto">
          <GovButton
            variant="outline"
            onClick={() => navigate("/manager/attendance/bulk-upload")}
            className="gap-2"
          >
            <Upload size={16} /> Bulk Upload Attendance
          </GovButton>

          <GovButton
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/manager/attendance/holiday-pattern")}
          >
            <Calendar size={16} /> Set Holiday Pattern
          </GovButton>
        </div>
      </div>

      <GovCard className="p-0 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            {user?.department_id ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <div className="h-10 px-3 flex items-center rounded-md border bg-gray-100 text-gray-700">
                  {user.department_name}
                </div>
              </div>
            ) : (
              <div className="md:col-span-2">
                <GovSelect
                  label="Department"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  options={[
                    { value: "", label: "-- Select Department --" },
                    ...departments.map((d) => ({
                      value: d.id,
                      label: `${d.code} - ${d.name}`,
                    })),
                  ]}
                />
              </div>
            )}
          </div>
          <GovSelect
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            options={validYears.map((y) => ({
              value: y,
              label: y.toString(),
            }))}
          />
          <GovSelect
            label="Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            options={validMonths}
          />
        </div>

        {/* Content */}
        {!selectedDept ? (
          <div className="p-12 text-center text-gray-500">
            Select a department to view attendance.
          </div>
        ) : error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center gap-3">
            <p>{error}</p>
            <GovButton
              variant="outline"
              size="sm"
              onClick={fetchAttendance}
              className="gap-2"
            >
              <RefreshCw size={16} /> Retry
            </GovButton>
          </div>
        ) : (
          <GovTable>
            <GovTableHeader>
              <GovTableCell isHeader>Emp Code</GovTableCell>
              <GovTableCell isHeader>Employee Name</GovTableCell>
              <GovTableCell isHeader>Designation</GovTableCell>
              <GovTableCell isHeader className="text-center">
                Effective Days
              </GovTableCell>
              <GovTableCell isHeader className="text-right">
                Actions
              </GovTableCell>
            </GovTableHeader>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <GovTableRow hover={false}>
                  <GovTableCell
                    colSpan={5}
                    className="h-16 text-center text-gray-500"
                  >
                    Loading...
                  </GovTableCell>
                </GovTableRow>
              ) : attendanceData.length === 0 ? (
                <GovTableRow hover={false}>
                  <GovTableCell
                    colSpan={5}
                    className="h-32 text-center text-gray-500"
                  >
                    No data found.
                  </GovTableCell>
                </GovTableRow>
              ) : (
                attendanceData.map((emp) => (
                  <GovTableRow key={emp.employee_code}>
                    <GovTableCell className="font-mono font-bold text-gray-700">
                      {emp.employee_code}
                    </GovTableCell>
                    <GovTableCell className="font-semibold text-gray-900">
                      {emp.first_name} {emp.last_name}
                    </GovTableCell>
                    <GovTableCell>{emp.designation_name}</GovTableCell>
                    <GovTableCell className="text-center font-bold text-primary-dark text-lg">
                      {emp.present_summary}
                    </GovTableCell>
                    <GovTableCell className="text-right">
                      <GovButton
                        variant="outline"
                        size="sm"
                        className="gap-2 text-xs"
                        onClick={() =>
                          navigate("/manager/attendance/calendar", {
                            state: {
                              empCode: emp.employee_code,
                              month: selectedMonth,
                              year: selectedYear,
                              records: emp.daily_records,
                              leaveApps: emp.current_month_records,
                              name: `${emp.first_name} ${emp.last_name}`,
                            },
                          })
                        }
                      >
                        <Calendar size={14} /> View Calendar
                      </GovButton>
                    </GovTableCell>
                  </GovTableRow>
                ))
              )}
            </tbody>
          </GovTable>
        )}
      </GovCard>
    </div>
  );
}
