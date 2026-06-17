// src/pages/employee/LeaveApplication.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceService } from "../../api/attendanceService";
import { GovCard } from "../../components/ui/GovCard";
import { GovSelect } from "../../components/ui/GovSelect";
import { GovButton } from "../../components/ui/GovButton";
import { GovBadge } from "../../components/ui/GovBadge";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import { Plus, RefreshCw } from "lucide-react";

export function LeaveApplication() {
  const navigate = useNavigate();

  // Selection State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Data State
  const [allLeaves, setAllLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate valid years (From 2026 onwards)
  const currentYear = new Date().getFullYear();
  const validYears = [];
  for (let y = 2026; y <= Math.max(2026, currentYear); y++) {
    validYears.push(y);
  }

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

  const getFilteredMonths = () => {
    if (selectedYear === 2026) {
      return validMonths.filter((m) => m.value >= 6); // June onwards for 2026
    }
    return validMonths;
  };

  const fetchMyLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getMyLeaveHistory(1, 100);
      setAllLeaves(data.results || []);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      setError("Unable to load your leave history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  // Filter local state when month/year dropdowns change
  useEffect(() => {
    const filtered = allLeaves.filter((leave) => {
      const startDate = new Date(leave.start_date);
      return (
        startDate.getFullYear() === selectedYear &&
        startDate.getMonth() + 1 === selectedMonth
      );
    });
    setFilteredLeaves(filtered);
  }, [allLeaves, selectedMonth, selectedYear]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "warning"; // PENDING
    }
  };

  const getLeaveTypeDisplay = (type) => {
    switch (type) {
      case "MATERNITY":
        return "Maternity Leave (ML)";
      case "CASUAL":
        return "Casual Leave (CL)";
      case "SICK":
        return "Sick Leave (SL)";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            My Leave Applications
          </h2>
          <p className="text-sm text-gray-500">
            View your past requests and track their status.
          </p>
        </div>
        <div className="flex gap-3">
          <GovButton
            variant="outline"
            className="gap-2"
            onClick={fetchMyLeaves}
          >
            <RefreshCw size={16} /> Refresh
          </GovButton>
          <GovButton
            variant="primary"
            className="gap-2"
            onClick={() => navigate("/employee/LA/apply/new")}
          >
            <Plus size={16} /> Apply for Leave
          </GovButton>
        </div>
      </div>

      <GovCard className="p-0 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4 items-center">
          <div className="w-48">
            <GovSelect
              label="Year"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                if (Number(e.target.value) === 2026 && selectedMonth < 6)
                  setSelectedMonth(6);
              }}
              options={validYears.map((y) => ({
                value: y,
                label: y.toString(),
              }))}
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
        </div>

        {/* Content */}
        {error ? (
          <div className="p-8 text-center text-danger font-medium">{error}</div>
        ) : (
          <GovTable>
            <GovTableHeader>
              <GovTableCell isHeader>Leave Type</GovTableCell>
              <GovTableCell isHeader>Date Range</GovTableCell>
              <GovTableCell isHeader>Reason</GovTableCell>
              <GovTableCell isHeader>Applied On</GovTableCell>
              <GovTableCell isHeader className="text-right">
                Status
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
              ) : filteredLeaves.length === 0 ? (
                <GovTableRow hover={false}>
                  <GovTableCell
                    colSpan={5}
                    className="h-32 text-center text-gray-500"
                  >
                    No leave applications found for this month.
                  </GovTableCell>
                </GovTableRow>
              ) : (
                filteredLeaves.map((app) => (
                  <GovTableRow key={app.id}>
                    <GovTableCell className="font-semibold text-gray-800">
                      {getLeaveTypeDisplay(app.leave_type)}
                    </GovTableCell>
                    <GovTableCell className="text-sm font-medium text-gray-700">
                      {app.start_date}{" "}
                      <span className="mx-1 text-gray-400">to</span>{" "}
                      {app.end_date}
                    </GovTableCell>
                    <GovTableCell>
                      <span
                        className="text-sm text-gray-600 truncate block max-w-[200px]"
                        title={app.reason}
                      >
                        {app.reason || "N/A"}
                      </span>
                    </GovTableCell>
                    <GovTableCell className="text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </GovTableCell>
                    <GovTableCell className="text-right">
                      <GovBadge variant={getStatusBadgeVariant(app.status)}>
                        {app.status}
                      </GovBadge>
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
