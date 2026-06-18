// src/pages/manager/Payroll/components/CreateRunModal.jsx
import { useState, useEffect } from "react";
import { GovModal } from "../../../../components/ui/GovModal";
import { GovSelect } from "../../../../components/ui/GovSelect";
import { GovButton } from "../../../../components/ui/GovButton";
import { salService } from "../../../../api/SalService";

export function CreateRunModal({ isOpen, onClose, departmentId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [structures, setStructures] = useState([]);

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

  // Fetch available salary structures when the modal opens
  useEffect(() => {
    if (isOpen && departmentId) {
      setError("");
      setLoading(true);
      salService
        .getSalaryStructures(departmentId, 1, 100)
        .then((data) => {
          const fetchedStructures = data.results || [];
          setStructures(fetchedStructures);

          // Auto-select the first available structure if any exist
          if (fetchedStructures.length > 0) {
            setFormData((prev) => ({
              ...prev,
              salary_structure: fetchedStructures[0].id,
            }));
          } else {
            setFormData((prev) => ({ ...prev, salary_structure: "" }));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch salary structures:", err);
          setError(
            "Failed to load active salary structures. Please check your connection.",
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, departmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.salary_structure) {
      setError(
        "You must select an applicable Salary Structure to create a payroll run.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create the empty PayrollRun "shell" via the passed-in success handler
      await onSuccess(formData);
    } catch (err) {
      // The parent component should ideally handle passing the exact error string back,
      // but we catch it here just in case the parent throws it back down.
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          err.message ||
          "Failed to initialize the payroll run. A run for this month and year might already exist.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GovModal
      isOpen={isOpen}
      onClose={() => !loading && onClose()}
      title="Initialize New Payroll Run"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GovSelect
            id="pay_month"
            label="Payroll Month"
            value={formData.pay_month}
            onChange={(e) =>
              setFormData({ ...formData, pay_month: Number(e.target.value) })
            }
            options={monthNames.map((name, i) => ({
              value: i + 1,
              label: name,
            }))}
            required
            disabled={loading}
          />
          <GovSelect
            id="pay_year"
            label="Payroll Year"
            value={formData.pay_year}
            onChange={(e) =>
              setFormData({ ...formData, pay_year: Number(e.target.value) })
            }
            options={validYears.map((y) => ({ value: y, label: y.toString() }))}
            required
            disabled={loading}
          />
        </div>

        <div>
          <GovSelect
            id="salary_structure"
            label="Applicable Salary Structure (Deduction Rates)"
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
          <p className="text-xs text-gray-500 mt-1">
            The selected salary structure dictates the global deduction
            percentages for this specific month's payroll processing.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
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
            disabled={loading || structures.length === 0}
          >
            {loading ? "Initializing..." : "Create Run Shell"}
          </GovButton>
        </div>
      </form>
    </GovModal>
  );
}
