// src/pages/manager/Payroll/PayrollList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { payrollService } from "../../../api/payrollService";
import { salService } from "../../../api/SalService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovButton } from "../../../components/ui/GovButton";
import { GovBadge } from "../../../components/ui/GovBadge";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovModal } from "../../../components/ui/GovModal";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../../components/ui/GovTable";
import {
  Plus,
  Eye,
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight,
  Calculator,
} from "lucide-react";

export function PayrollList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const departmentId = user?.department_id;

  // List State
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [computingId, setComputingId] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const pageSize = 15;

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [structures, setStructures] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [formData, setFormData] = useState({
    pay_month: new Date().getMonth() + 1,
    pay_year: new Date().getFullYear(),
    salary_structure: "",
  });

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

  const currentYear = new Date().getFullYear();
  const validYears = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
  ];

  const fetchRuns = async () => {
    if (!departmentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await payrollService.getPayrollRuns(
        departmentId,
        page,
        pageSize,
      );
      setRuns(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch (err) {
      console.error("Failed to fetch payroll runs:", err);
      setError("Unable to load payroll runs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStructures = async () => {
    if (!departmentId) return;
    try {
      // Fetch available salary structures for this department to link to the run
      const data = await salService.getSalaryStructures(departmentId, 1, 100);
      setStructures(data.results || []);
      if (data.results && data.results.length > 0) {
        setFormData((prev) => ({
          ...prev,
          salary_structure: data.results[0].id,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch salary structures:", err);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, [page, departmentId]);

  const handleOpenModal = () => {
    setCreateError("");
    fetchStructures();
    setIsModalOpen(true);
  };

  const handleCreateRun = async (e) => {
    e.preventDefault();
    if (!formData.salary_structure) {
      setCreateError("Please select a Salary Structure.");
      return;
    }

    setCreateLoading(true);
    setCreateError("");
    try {
      // 1. Create the empty PayrollRun "shell"
      const newRun = await payrollService.createPayrollRun(
        departmentId,
        formData,
      );

      // 2. Automatically trigger the computation engine to fetch attendance and compute pay
      await payrollService.generatePayrollRecords(departmentId, newRun.id);

      setIsModalOpen(false);
      setPage(1);
      fetchRuns();
    } catch (err) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        "Failed to create payroll run. A run for this month may already exist.";
      setCreateError(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleComputeRun = async (runId) => {
    setComputingId(runId);
    try {
      await payrollService.generatePayrollRecords(departmentId, runId);
      fetchRuns();
    } catch (err) {
      console.error("Computation failed:", err);
      alert(err.response?.data?.detail || "Failed to compute records.");
    } finally {
      setComputingId(null);
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!departmentId) {
    return (
      <div className="p-8 text-center text-gray-500">
        Department context missing. Cannot load payroll.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payroll Runs</h2>
          <p className="text-sm text-gray-500">
            Manage and process monthly salary batches for your department.
          </p>
        </div>
        <div className="flex gap-3">
          <GovButton variant="outline" className="gap-2" onClick={fetchRuns}>
            <RefreshCw size={16} /> Refresh
          </GovButton>
          <GovButton
            variant="primary"
            className="gap-2"
            onClick={handleOpenModal}
          >
            <Plus size={16} /> New Payroll Run
          </GovButton>
        </div>
      </div>

      <GovCard className="p-0 overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-danger font-medium flex flex-col items-center gap-3">
            <p>{error}</p>
            <GovButton
              variant="outline"
              size="sm"
              onClick={fetchRuns}
              className="gap-2"
            >
              <RefreshCw size={16} /> Retry
            </GovButton>
          </div>
        ) : (
          <>
            <GovTable>
              <GovTableHeader>
                <GovTableCell isHeader>Month / Year</GovTableCell>
                <GovTableCell isHeader>Status</GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Total Gross
                </GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Total Deductions
                </GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Total Net Pay
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
                ) : runs.length === 0 ? (
                  <GovTableRow hover={false}>
                    <GovTableCell
                      colSpan={6}
                      className="h-32 text-center text-gray-500"
                    >
                      No payroll runs found for this department.
                    </GovTableCell>
                  </GovTableRow>
                ) : (
                  runs.map((run) => (
                    <GovTableRow key={run.id}>
                      <GovTableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-primary-dark">
                            <FileText size={20} />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">
                              {monthNames[run.pay_month - 1]} {run.pay_year}
                            </span>
                            <span className="text-xs text-gray-500">
                              Run ID: #{run.id}
                            </span>
                          </div>
                        </div>
                      </GovTableCell>
                      <GovTableCell>
                        <GovBadge variant={getStatusVariant(run.status)}>
                          {run.status}
                        </GovBadge>
                      </GovTableCell>
                      <GovTableCell className="text-right font-medium text-gray-700">
                        {formatCurrency(run.total_gross)}
                      </GovTableCell>
                      <GovTableCell className="text-right font-medium text-danger">
                        {formatCurrency(run.total_deductions)}
                      </GovTableCell>
                      <GovTableCell className="text-right font-bold text-green-700">
                        {formatCurrency(run.total_net)}
                      </GovTableCell>
                      <GovTableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {run.status === "DRAFT" && (
                            <GovButton
                              variant="primary"
                              size="sm"
                              className="gap-2 text-xs"
                              disabled={computingId === run.id}
                              onClick={() => handleComputeRun(run.id)}
                            >
                              <Calculator size={14} />
                              {computingId === run.id
                                ? "Computing..."
                                : "Compute"}
                            </GovButton>
                          )}
                          <GovButton
                            variant="outline"
                            size="sm"
                            className="gap-2 text-xs"
                            onClick={() =>
                              navigate(`/manager/payroll/${run.id}`)
                            }
                          >
                            <Eye size={14} /> View Details
                          </GovButton>
                        </div>
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
                <span className="ml-2">({totalCount} runs)</span>
              </span>
              <div className="flex gap-2">
                <GovButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
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

      {/* Create Run Modal */}
      <GovModal
        isOpen={isModalOpen}
        onClose={() => !createLoading && setIsModalOpen(false)}
        title="Initialize New Payroll Run"
      >
        <form onSubmit={handleCreateRun} className="space-y-5">
          {createError && (
            <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
              {createError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <GovSelect
              label="Month"
              value={formData.pay_month}
              onChange={(e) =>
                setFormData({ ...formData, pay_month: Number(e.target.value) })
              }
              options={monthNames.map((name, i) => ({
                value: i + 1,
                label: name,
              }))}
              required
            />
            <GovSelect
              label="Year"
              value={formData.pay_year}
              onChange={(e) =>
                setFormData({ ...formData, pay_year: Number(e.target.value) })
              }
              options={validYears.map((y) => ({
                value: y,
                label: y.toString(),
              }))}
              required
            />
          </div>

          <GovSelect
            label="Applicable Salary Structure (Rates)"
            value={formData.salary_structure}
            onChange={(e) =>
              setFormData({ ...formData, salary_structure: e.target.value })
            }
            required
            disabled={loading || structures.length === 0}
            options={
              structures.length === 0
                ? [
                    {
                      value: "",
                      label: "No structures configured for this department",
                    },
                  ]
                : [
                    { value: "", label: "-- Select Structure --" },
                    ...structures.map((s) => ({
                      value: s.id,
                      label: `Effective from: ${s.effective_from} (TDS: ${s.tds_rate}%, EPF: ${s.epf_rate}%, ESIC: ${s.esic_rate}%)`,
                    })),
                  ]
            }
          />
          <p className="text-xs text-gray-500 -mt-2">
            The selected salary structure dictates the deduction percentages for
            this specific month's payroll processing. The engine will
            auto-compute attendance directly.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <GovButton
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={createLoading}
            >
              Cancel
            </GovButton>
            <GovButton
              type="submit"
              variant="primary"
              disabled={createLoading || structures.length === 0}
            >
              {createLoading ? "Initializing..." : "Create & Compute Run"}
            </GovButton>
          </div>
        </form>
      </GovModal>
    </div>
  );
}
