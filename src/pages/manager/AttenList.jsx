// src/pages/manager/AttenList.jsx
import { useState, useEffect, useMemo } from "react";
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
import {
  Calendar,
  Upload,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import * as XLSX from "xlsx"; // Ensure you have installed xlsx: npm install xlsx

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

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
      setCurrentPage(1); // Reset to first page on new fetch
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

  // Derived Pagination State
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return attendanceData.slice(startIndex, startIndex + recordsPerPage);
  }, [attendanceData, currentPage]);

  const totalPages = Math.ceil(attendanceData.length / recordsPerPage) || 1;

  // Export to Excel Functionality
  const handleExportExcel = () => {
    if (!attendanceData || attendanceData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // 1. Format the data for Excel
    const exportData = attendanceData.map((emp, index) => {
      const [presentDays, workingDays] = (emp.present_summary || "0/0").split(
        "/",
      );

      return {
        "S.No.": index + 1,
        "Employee Code": emp.employee_code,
        "Employee Name": `${emp.first_name} ${emp.last_name}`,
        Designation: emp.designation_name,
        Theme: emp.theme || "Not Set",
        "Present Days": presentDays,
        "Working Days": workingDays,

        "Maternity Leaves": emp.yearly_leave_balances?.MATERNITY ?? 0,
        "Casual Leaves": emp.yearly_leave_balances?.CASUAL ?? 0,
        "Sick Leaves": emp.yearly_leave_balances?.SICK ?? 0,
        "Earned Leaves": emp.yearly_leave_balances?.EARNED ?? 0,
        "Leaves Without Pay": emp.yearly_leave_balances?.LWP ?? 0,
        "ESL Leaves": emp.yearly_leave_balances?.ESL ?? 0,
      };
    });

    // 2. Create Workbook and Worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // 3. Generate file name based on filters
    let deptName = "DEPT";
    if (user?.department_id && String(user.department_id) === selectedDept) {
      deptName = user.department_name;
    } else {
      deptName =
        departments.find((d) => d.id === Number(selectedDept))?.code || "DEPT";
    }
    const monthName =
      validMonths.find((m) => m.value === selectedMonth)?.label || "Month";
    const fileName = `Attendance_${deptName}_${monthName}_${selectedYear}.xlsx`;

    // 4. Download
    XLSX.writeFile(workbook, fileName);
  };

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

          <GovButton
            variant="primary"
            className="gap-2"
            onClick={handleExportExcel}
            disabled={loading || attendanceData.length === 0}
          >
            <Download size={16} /> Export to Excel
          </GovButton>
        </div>
      </div>

      <GovCard className="p-0 overflow-hidden flex flex-col min-h-[500px]">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
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
          <div className="p-12 text-center text-gray-500 flex-1 flex items-center justify-center">
            Select a department to view attendance.
          </div>
        ) : error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center justify-center gap-3 flex-1">
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
          <>
            <div className="flex-1 overflow-x-auto">
              <GovTable>
                <GovTableHeader>
                  <GovTableCell isHeader className="w-16 text-center">
                    S.No.
                  </GovTableCell>
                  <GovTableCell isHeader>Emp Code</GovTableCell>
                  <GovTableCell isHeader>Employee Name</GovTableCell>
                  <GovTableCell isHeader>Designation</GovTableCell>
                  <GovTableCell isHeader>Theme</GovTableCell>
                  <GovTableCell isHeader className="text-center">
                    Present Days / Working Days
                  </GovTableCell>
                  <GovTableCell isHeader className="text-center">
                    Maternity Leaves
                  </GovTableCell>
                  <GovTableCell isHeader className="text-center">
                    Casual Leaves
                  </GovTableCell>
                  <GovTableCell isHeader className="text-center">
                    Sick Leaves
                  </GovTableCell>
                  <GovTableCell isHeader className="text-center">
                    Earned Leaves
                  </GovTableCell>
                  <GovTableCell isHeader className="text-center">
                    Leaves Without Pay
                  </GovTableCell>
                  <GovTableCell isHeader className="text-center">
                    ESL Leaves
                  </GovTableCell>
                  <GovTableCell isHeader className="text-right">
                    Actions
                  </GovTableCell>
                </GovTableHeader>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <GovTableRow hover={false}>
                      <GovTableCell
                        colSpan={7}
                        className="h-16 text-center text-gray-500"
                      >
                        Loading...
                      </GovTableCell>
                    </GovTableRow>
                  ) : attendanceData.length === 0 ? (
                    <GovTableRow hover={false}>
                      <GovTableCell
                        colSpan={7}
                        className="h-32 text-center text-gray-500"
                      >
                        No data found.
                      </GovTableCell>
                    </GovTableRow>
                  ) : (
                    paginatedData.map((emp, index) => {
                      // Calculate global serial number across pages
                      const serialNumber =
                        (currentPage - 1) * recordsPerPage + index + 1;

                      return (
                        <GovTableRow key={emp.employee_code}>
                          <GovTableCell className="text-center text-gray-500 text-sm">
                            {serialNumber}
                          </GovTableCell>
                          <GovTableCell className="font-mono font-bold text-gray-700">
                            {emp.employee_code}
                          </GovTableCell>
                          <GovTableCell className="font-semibold text-gray-900">
                            {emp.first_name} {emp.last_name}
                          </GovTableCell>
                          <GovTableCell>{emp.designation_name}</GovTableCell>
                          <GovTableCell>{emp.theme || "Not Set"}</GovTableCell>
                          <GovTableCell className="text-center font-bold text-primary-dark text-lg">
                            {emp.present_summary}
                          </GovTableCell>
                          <GovTableCell className="text-center font-bold text-primary-dark text-lg">
                            {emp.yearly_leave_balances?.MATERNITY ?? 0}
                          </GovTableCell>

                          <GovTableCell className="text-center font-bold text-primary-dark text-lg">
                            {emp.yearly_leave_balances?.CASUAL ?? 0}
                          </GovTableCell>

                          <GovTableCell className="text-center font-bold text-primary-dark text-lg">
                            {emp.yearly_leave_balances?.SICK ?? 0}
                          </GovTableCell>

                          <GovTableCell className="text-center font-bold text-primary-dark text-lg">
                            {emp.yearly_leave_balances?.EARNED ?? 0}
                          </GovTableCell>

                          <GovTableCell className="text-center font-bold text-primary-dark text-lg">
                            {emp.yearly_leave_balances?.LWP ?? 0}
                          </GovTableCell>

                          <GovTableCell className="text-center font-bold text-primary-dark text-lg">
                            {emp.yearly_leave_balances?.ESL ?? 0}
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
                      );
                    })
                  )}
                </tbody>
              </GovTable>
            </div>

            {/* Pagination Controls */}
            {!loading && attendanceData.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
                <span className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(
                      (currentPage - 1) * recordsPerPage + 1,
                      attendanceData.length,
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(
                      currentPage * recordsPerPage,
                      attendanceData.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {attendanceData.length}
                  </span>{" "}
                  records
                </span>
                <div className="flex gap-2">
                  <GovButton
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft size={16} /> Prev
                  </GovButton>
                  <div className="flex items-center px-3 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <GovButton
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next <ChevronRight size={16} />
                  </GovButton>
                </div>
              </div>
            )}
          </>
        )}
      </GovCard>
    </div>
  );
}
