// src/pages/manager/Payroll/components/EditRecordModal.jsx
import { useState, useEffect } from "react";
import { GovModal } from "../../../../components/ui/GovModal";
import { GovInput } from "../../../../components/ui/GovInput";
import { GovButton } from "../../../../components/ui/GovButton";
import { GovSeparator } from "../../../../components/ui/GovSeparator";
import { payrollService } from "../../../../api/payrollService";
import { Calculator } from "lucide-react";

export function EditRecordModal({
  isOpen,
  onClose,
  record,
  departmentId,
  runId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Local state for the editable fields
  const [formData, setFormData] = useState({
    days_present: 0,
    gross_pay: 0,
    tds_amount: 0,
    epf_amount: 0,
    esic_amount: 0,
    other_deductions: 0,
  });

  // Derived state for display
  const [computedNetPay, setComputedNetPay] = useState(0);
  const [computedTotalDed, setComputedTotalDed] = useState(0);

  useEffect(() => {
    if (record && isOpen) {
      setFormData({
        days_present: Number(record.days_present) || 0,
        gross_pay: Number(record.gross_pay) || 0,
        tds_amount: Number(record.tds_amount) || 0,
        epf_amount: Number(record.epf_amount) || 0,
        esic_amount: Number(record.esic_amount) || 0,
        other_deductions: Number(record.other_deductions) || 0,
      });
    }
  }, [record, isOpen]);

  // Recalculate totals whenever form inputs change
  useEffect(() => {
    const totalDeductions =
      Number(formData.tds_amount) +
      Number(formData.epf_amount) +
      Number(formData.esic_amount) +
      Number(formData.other_deductions);

    const net = Number(formData.gross_pay) - totalDeductions;

    setComputedTotalDed(totalDeductions);
    setComputedNetPay(net);
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Allow empty string for backspacing, otherwise parse float
    const parsedValue = value === "" ? "" : parseFloat(value);

    setFormData((prev) => ({
      ...prev,
      [id]: parsedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prepare payload. We must send the newly computed totals as well.
    const payload = {
      days_present: formData.days_present || 0,
      gross_pay: formData.gross_pay || 0,
      tds_amount: formData.tds_amount || 0,
      epf_amount: formData.epf_amount || 0,
      esic_amount: formData.esic_amount || 0,
      other_deductions: formData.other_deductions || 0,
      total_deductions: computedTotalDed,
      net_pay: computedNetPay,
    };

    try {
      await payrollService.updatePayrollRecord(
        departmentId,
        runId,
        record.id,
        payload,
      );
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to update the payroll record. Please check your inputs.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  const empName = record.employee?.user?.first_name
    ? `${record.employee.user.first_name} ${record.employee.user.last_name || ""}`
    : record.employee_name || "Unknown";

  const empCode =
    record.employee?.user?.employee_code || record.employee_code || "N/A";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <GovModal
      isOpen={isOpen}
      onClose={() => !loading && onClose()}
      title="Edit Payroll Record"
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        {/* Employee Context Box */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded flex justify-between items-center">
          <div>
            <h4 className="font-bold text-gray-900">{empName}</h4>
            <p className="text-sm font-mono text-gray-600">
              {empCode} • {record.designation_snapshot}
            </p>
          </div>
          <div className="text-right">
            <span className="block text-xs text-gray-500 uppercase tracking-wide">
              Base Honorarium
            </span>
            <span className="font-bold text-gray-800">
              {formatCurrency(record.monthly_honorarium)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column: Earnings & Attendance */}
          <div className="space-y-5">
            <h5 className="font-bold text-gray-800 border-b border-gray-200 pb-1 flex items-center gap-2">
              Earnings & Days
            </h5>

            <GovInput
              id="days_present"
              type="number"
              step="0.5"
              min="0"
              max={record.total_working_days}
              label={`Effective Days (Max: ${record.total_working_days})`}
              value={formData.days_present}
              onChange={handleChange}
              required
            />

            <GovInput
              id="gross_pay"
              type="number"
              step="0.01"
              min="0"
              label="Pro-rated Gross Pay (₹)"
              value={formData.gross_pay}
              onChange={handleChange}
              required
            />
          </div>

          {/* Right Column: Deductions */}
          <div className="space-y-5">
            <h5 className="font-bold text-gray-800 border-b border-gray-200 pb-1 text-danger">
              Deductions
            </h5>

            <GovInput
              id="epf_amount"
              type="number"
              step="0.01"
              min="0"
              label="EPF Amount (₹)"
              value={formData.epf_amount}
              onChange={handleChange}
            />

            <GovInput
              id="esic_amount"
              type="number"
              step="0.01"
              min="0"
              label="ESIC Amount (₹)"
              value={formData.esic_amount}
              onChange={handleChange}
            />

            <GovInput
              id="tds_amount"
              type="number"
              step="0.01"
              min="0"
              label="TDS Amount (₹)"
              value={formData.tds_amount}
              onChange={handleChange}
            />

            <GovInput
              id="other_deductions"
              type="number"
              step="0.01"
              min="0"
              label="Other Deductions (₹)"
              value={formData.other_deductions}
              onChange={handleChange}
            />
          </div>
        </div>

        <GovSeparator />

        {/* Live Calculation Preview */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
          <h5 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Calculator size={16} /> Live Calculation Preview
          </h5>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="block text-xs text-gray-500 mb-1">
                Gross Pay
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {formatCurrency(formData.gross_pay)}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">
                Total Deductions
              </span>
              <span className="text-lg font-semibold text-danger">
                {formatCurrency(computedTotalDed)}
              </span>
            </div>
            <div className="pl-4 border-l-2 border-gray-300">
              <span className="block text-xs text-gray-500 mb-1">
                Final Net Pay
              </span>
              <span className="text-2xl font-black text-green-700">
                {formatCurrency(computedNetPay)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <GovButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </GovButton>
          <GovButton
            type="submit"
            variant="primary"
            disabled={loading || computedNetPay < 0}
          >
            {loading ? "Saving..." : "Save Record"}
          </GovButton>
        </div>
      </form>
    </GovModal>
  );
}
