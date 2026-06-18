// src/pages/manager/Payroll/PayrollDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { payrollService } from "../../../api/payrollService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovButton } from "../../../components/ui/GovButton";
import { GovBadge } from "../../../components/ui/GovBadge";
import { GovStatCard } from "../../../components/ui/GovStatCard";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../../components/ui/GovTable";
import {
  ArrowLeft,
  CheckCircle,
  Pencil,
  RefreshCw,
  IndianRupee,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { EditRecordModal } from "./components/EditRecordModal";

export function PayrollDetail() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const departmentId = user?.department_id;

  const [run, setRun] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination for records
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 20;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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

  const fetchData = async () => {
    if (!departmentId || !runId) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch specific run details (by fetching list and filtering, or assuming backend returns it in the records payload.
      // For safety, we fetch the run list to extract totals and status).
      const runsData = await payrollService.getPayrollRuns(
        departmentId,
        1,
        100,
      );
      const currentRun = runsData.results?.find(
        (r) => r.id === parseInt(runId, 10),
      );

      if (!currentRun) {
        throw new Error("Payroll run not found.");
      }
      setRun(currentRun);

      // Fetch Records
      const recordsData = await payrollService.getPayrollRecords(
        departmentId,
        runId,
        page,
        pageSize,
      );
      setRecords(recordsData.results || []);
      setTotalCount(recordsData.count || 0);
      setHasNext(!!recordsData.next);
      setHasPrev(!!recordsData.previous);
    } catch (err) {
      console.error("Failed to fetch payroll details:", err);
      setError("Unable to load payroll records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [departmentId, runId, page]);

  const handleApproveRun = async () => {
    if (
      !window.confirm(
        "Are you sure you want to approve this payroll run? This action will lock the records and allow salary slip generation.",
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await payrollService.updatePayrollRun(departmentId, runId, {
        status: "APPROVED",
      });
      await fetchData(); // Refresh data to show updated status
    } catch (err) {
      console.error("Failed to approve run:", err);
      alert(
        "Failed to approve the payroll run. Please check console for details.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "DRAFT":
        return "neutral";
      case "PROCESSING":
        return "warning";
      case "COMPLETED":
        return "primary";
      case "APPROVED":
        return "success";
      case "LOCKED":
        return "success";
      default:
        return "neutral";
    }
  };

  if (!departmentId) {
    return (
      <div className="p-8 text-center text-gray-500">
        Department context missing.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/manager/payroll")}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">
                Payroll Details
              </h2>
              {run && (
                <GovBadge variant={getStatusVariant(run.status)}>
                  {run.status}
                </GovBadge>
              )}
            </div>
            {run && (
              <p className="text-sm font-medium text-primary-dark mt-1">
                {monthNames[run.pay_month - 1]} {run.pay_year} • Run #{run.id}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <GovButton
            variant="outline"
            className="gap-2"
            onClick={fetchData}
            disabled={loading || actionLoading}
          >
            <RefreshCw size={16} /> Refresh
          </GovButton>

          {run && (run.status === "COMPLETED" || run.status === "COMPUTED") && (
            <GovButton
              variant="success"
              className="gap-2"
              onClick={handleApproveRun}
              disabled={actionLoading}
            >
              <CheckCircle size={16} />
              {actionLoading ? "Approving..." : "Approve & Lock Run"}
            </GovButton>
          )}
        </div>
      </div>

      {error ? (
        <GovCard className="p-8 text-center text-danger font-medium flex flex-col items-center gap-3">
          <p>{error}</p>
          <GovButton
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="gap-2"
          >
            <RefreshCw size={16} /> Retry
          </GovButton>
        </GovCard>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GovStatCard
              title="Total Gross Pay"
              value={run ? formatCurrency(run.total_gross) : "₹0"}
              icon={IndianRupee}
              variant="primary"
            />
            <GovStatCard
              title="Total Deductions"
              value={run ? formatCurrency(run.total_deductions) : "₹0"}
              icon={TrendingDown}
              variant="danger"
            />
            <GovStatCard
              title="Total Net Pay"
              value={run ? formatCurrency(run.total_net) : "₹0"}
              icon={Wallet}
              variant="success"
            />
          </div>

          {/* Records Table */}
          <GovCard className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                Computed Employee Records
              </h3>
              <span className="text-sm text-gray-500 font-medium">
                Total: {totalCount}
              </span>
            </div>

            <GovTable>
              <GovTableHeader>
                <GovTableCell isHeader>Employee</GovTableCell>
                <GovTableCell isHeader className="text-center">
                  Effective Days
                </GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Gross Pay
                </GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Deductions
                </GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Net Pay
                </GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Actions
                </GovTableCell>
              </GovTableHeader>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <GovTableRow key={i} hover={false}>
                      <GovTableCell colSpan={6} className="h-16">
                        <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                      </GovTableCell>
                    </GovTableRow>
                  ))
                ) : records.length === 0 ? (
                  <GovTableRow hover={false}>
                    <GovTableCell
                      colSpan={6}
                      className="h-32 text-center text-gray-500"
                    >
                      No payroll records generated yet.
                    </GovTableCell>
                  </GovTableRow>
                ) : (
                  records.map((record) => {
                    // Handle safely depending on nested or flat serializer output
                    const empCode =
                      record.employee?.user?.employee_code ||
                      record.employee_code ||
                      "N/A";
                    const empName = record.employee?.user?.first_name
                      ? `${record.employee.user.first_name} ${record.employee.user.last_name || ""}`
                      : record.employee_name || "Unknown";

                    return (
                      <GovTableRow key={record.id}>
                        <GovTableCell>
                          <div className="font-semibold text-gray-900">
                            {empName}
                          </div>
                          <div className="text-xs font-mono text-gray-500">
                            {empCode} • {record.designation_snapshot}
                          </div>
                        </GovTableCell>
                        <GovTableCell className="text-center font-medium">
                          <span
                            className={
                              record.days_present < record.total_working_days
                                ? "text-orange-600"
                                : "text-green-600"
                            }
                          >
                            {record.days_present}
                          </span>{" "}
                          / {record.total_working_days}
                        </GovTableCell>
                        <GovTableCell className="text-right font-medium text-gray-700">
                          {formatCurrency(record.gross_pay)}
                        </GovTableCell>
                        <GovTableCell className="text-right font-medium text-danger">
                          {formatCurrency(record.total_deductions)}
                        </GovTableCell>
                        <GovTableCell className="text-right font-bold text-green-700 text-base">
                          {formatCurrency(record.net_pay)}
                        </GovTableCell>
                        <GovTableCell className="text-right">
                          <GovButton
                            variant="outline"
                            size="sm"
                            className="gap-2 text-xs"
                            disabled={
                              run?.status === "APPROVED" ||
                              run?.status === "LOCKED"
                            }
                            onClick={() => handleEditClick(record)}
                          >
                            <Pencil size={14} /> Edit
                          </GovButton>
                        </GovTableCell>
                      </GovTableRow>
                    );
                  })
                )}
              </tbody>
            </GovTable>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <GovButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev || loading}
                >
                  Previous
                </GovButton>
                <GovButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext || loading}
                >
                  Next
                </GovButton>
              </div>
            </div>
          </GovCard>
        </>
      )}

      {/* Manual Edit Record Modal */}
      {isEditModalOpen && selectedRecord && (
        <EditRecordModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={selectedRecord}
          departmentId={departmentId}
          runId={runId}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchData(); // Refresh the list after an edit
          }}
        />
      )}
    </div>
  );
}
