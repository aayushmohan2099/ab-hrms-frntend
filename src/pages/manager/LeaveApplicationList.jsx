// src/pages/manager/LeaveApplicationList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceService } from "../../api/attendanceService";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import { GovBadge } from "../../components/ui/GovBadge";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import { ChevronLeft, ChevronRight, Eye, RefreshCw } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function LeaveApplicationList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 15;

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getManagerLeaveList(page, pageSize);
      setApplications(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch (err) {
      console.error("Failed to fetch leave applications:", err);
      if (err.response?.status === 403) {
        setError("You are not authorized to view this list.");
      } else {
        setError(
          "Unable to load leave applications. Please check your connection.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

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
            Leave Applications
          </h2>
          <p className="text-sm text-gray-500">
            Review and manage leave requests for{" "}
            {user?.department_name || "your department"}.
          </p>
        </div>
        <GovButton
          variant="outline"
          className="gap-2"
          onClick={fetchApplications}
        >
          <RefreshCw size={16} /> Refresh
        </GovButton>
      </div>

      <GovCard className="p-0 overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center gap-3">
            <p>{error}</p>
            <GovButton
              variant="outline"
              size="sm"
              onClick={fetchApplications}
              className="gap-2"
            >
              <RefreshCw size={16} /> Retry
            </GovButton>
          </div>
        ) : (
          <>
            <GovTable>
              <GovTableHeader>
                <GovTableCell isHeader>Employee</GovTableCell>
                <GovTableCell isHeader>Leave Type</GovTableCell>
                <GovTableCell isHeader>Date Range</GovTableCell>
                <GovTableCell isHeader className="text-center">
                  Status
                </GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Actions
                </GovTableCell>
              </GovTableHeader>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <GovTableRow key={i} hover={false}>
                      <GovTableCell colSpan={5} className="h-16">
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                ) : applications.length === 0 ? (
                  <GovTableRow hover={false}>
                    <GovTableCell
                      colSpan={5}
                      className="h-32 text-center text-gray-500"
                    >
                      No leave applications found.
                    </GovTableCell>
                  </GovTableRow>
                ) : (
                  applications.map((app) => (
                    <GovTableRow key={app.id}>
                      <GovTableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {app.employee_name}
                          </span>
                          <span className="text-xs font-mono text-gray-500">
                            {app.employee_code} • {app.department_name}
                          </span>
                        </div>
                      </GovTableCell>
                      <GovTableCell className="font-medium text-gray-700">
                        {getLeaveTypeDisplay(app.leave_type)}
                      </GovTableCell>
                      <GovTableCell className="text-sm text-gray-600">
                        {app.start_date}{" "}
                        <span className="mx-1 text-gray-400">to</span>{" "}
                        {app.end_date}
                      </GovTableCell>
                      <GovTableCell className="text-center">
                        <GovBadge variant={getStatusBadgeVariant(app.status)}>
                          {app.status}
                        </GovBadge>
                      </GovTableCell>
                      <GovTableCell className="text-right">
                        <GovButton
                          variant="outline"
                          size="sm"
                          className="gap-2 text-xs"
                          onClick={() => navigate(`/manager/leaves/${app.id}`)}
                        >
                          <Eye size={14} /> View
                        </GovButton>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                )}
              </tbody>
            </GovTable>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600">
                Showing page{" "}
                <span className="font-semibold text-gray-900">{page}</span> of{" "}
                {Math.ceil(totalCount / pageSize) || 1}
                <span className="ml-2">({totalCount} records)</span>
              </span>
              <div className="flex gap-2">
                <GovButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPrev || loading}
                  className="gap-1"
                >
                  <ChevronLeft size={16} /> Prev
                </GovButton>
                <GovButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext || loading}
                  className="gap-1"
                >
                  Next <ChevronRight size={16} />
                </GovButton>
              </div>
            </div>
          </>
        )}
      </GovCard>
    </div>
  );
}
