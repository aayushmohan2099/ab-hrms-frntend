// src/pages/admin/EmpComps/EmpCustomSalStruct.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { salService } from "../../../api/SalService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovInput } from "../../../components/ui/GovInput";
import { GovButton } from "../../../components/ui/GovButton";
import { ArrowLeft, CheckCircle, Info } from "lucide-react";

export function EmpCustomSalStruct() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract selected employee codes passed via state
  const { employeeCodes = [] } = location.state || {};

  // Form State
  const [formData, setFormData] = useState({
    tds_amount: "0.00",
    epf_amount: "0.00",
    esic_amount: "0.00",
    effective_from: "",
    effective_to: "",
    remarks: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect back if accessed directly without selecting employees
  useEffect(() => {
    if (!employeeCodes || employeeCodes.length === 0) {
      navigate("/admin/employees");
    }
  }, [employeeCodes, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Build payload ensuring exact float formats and null for empty optional fields
    const payload = {
      employee_codes: employeeCodes,
      tds_amount: parseFloat(formData.tds_amount || 0).toFixed(2),
      epf_amount: parseFloat(formData.epf_amount || 0).toFixed(2),
      esic_amount: parseFloat(formData.esic_amount || 0).toFixed(2),
      effective_from: formData.effective_from,
      effective_to: formData.effective_to || null,
      remarks: formData.remarks || null,
    };

    try {
      await salService.bulkCreateCustomSalaryStructure(payload);
      setSuccess(
        `Custom salary structure successfully applied to ${employeeCodes.length} employee(s).`,
      );
      // Optional: Auto redirect after success, or clear form.
      // For now, let the user read the success message.
      setTimeout(() => {
        navigate("/admin/employees");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          (typeof err.response?.data === "object"
            ? JSON.stringify(err.response.data)
            : "Failed to apply custom structures."),
      );
    } finally {
      setSaving(false);
    }
  };

  if (!employeeCodes || employeeCodes.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Define Custom Salary Structure
          </h2>
          <p className="text-sm text-gray-500">
            Apply fixed deduction amounts for the selected employees.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Context & Selection Info */}
        <div className="md:col-span-1 space-y-6">
          <GovCard className="bg-blue-50 border-blue-200">
            <div className="flex gap-3 mb-3 text-primary-dark">
              <Info size={20} className="shrink-0" />
              <h3 className="font-bold text-sm">How it works</h3>
            </div>
            <div className="text-sm text-gray-700 space-y-3">
              <p>
                By defining a custom structure, the system will completely
                bypass the standard percentage-based department rules for these
                employees.
              </p>
              <p>
                The exact <strong>fixed amounts</strong> entered here will be
                deducted from their gross pay during payroll generation,
                regardless of their attendance or effective days.
              </p>
            </div>
          </GovCard>

          <GovCard>
            <h3 className="text-sm font-bold uppercase text-gray-600 mb-3 border-b pb-2">
              Selected Employees ({employeeCodes.length})
            </h3>
            <ul className="text-sm font-mono text-gray-800 max-h-60 overflow-y-auto space-y-1">
              {employeeCodes.map((code) => (
                <li key={code} className="px-2 py-1 bg-gray-50 rounded">
                  {code}
                </li>
              ))}
            </ul>
          </GovCard>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-2">
          <GovCard>
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-danger text-sm rounded border border-red-200 font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded border border-green-200 font-medium flex items-center gap-2">
                <CheckCircle size={18} /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4 border-b border-gray-200 pb-1">
                  Fixed Deduction Amounts (INR)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GovInput
                    id="tds_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    label="TDS Amount (₹)"
                    value={formData.tds_amount}
                    onChange={handleChange}
                    required
                  />
                  <GovInput
                    id="epf_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    label="EPF Amount (₹)"
                    value={formData.epf_amount}
                    onChange={handleChange}
                    required
                  />
                  <GovInput
                    id="esic_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    label="ESIC Amount (₹)"
                    value={formData.esic_amount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4 border-b border-gray-200 pb-1">
                  Validity Period
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GovInput
                    id="effective_from"
                    type="date"
                    label="Effective From"
                    value={formData.effective_from}
                    onChange={handleChange}
                    required
                    helpText="Must be the 1st of the payroll month."
                  />
                  <GovInput
                    id="effective_to"
                    type="date"
                    label="Effective To (Optional)"
                    value={formData.effective_to}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <GovInput
                id="remarks"
                label="Remarks / Reason"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="e.g., Override due to tax adjustment request."
              />

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <GovButton
                  type="submit"
                  variant="primary"
                  className="gap-2"
                  disabled={saving || employeeCodes.length === 0}
                >
                  {saving ? "Applying Structure..." : "Apply Fixed Structure"}
                </GovButton>
              </div>
            </form>
          </GovCard>
        </div>
      </div>
    </div>
  );
}
