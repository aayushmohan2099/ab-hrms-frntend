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

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYearValue = today.getFullYear();

  // Last day of the current month
  const lastDayOfCurrentMonth = new Date(
    currentYearValue,
    currentMonth,
    0,
  ).getDate();

  const isLastDayOfCurrentMonth = today.getDate() === lastDayOfCurrentMonth;

  // Initialize with the most appropriate valid month.
  // If it's not the last day of the current month, default to the previous month.
  let defaultMonth = currentMonth;
  let defaultYear = currentYearValue;

  if (!isLastDayOfCurrentMonth) {
    defaultMonth -= 1;
    if (defaultMonth < 1) {
      defaultMonth = 12;
      defaultYear -= 1;
    }
  }

  const [formData, setFormData] = useState({
    pay_month: defaultMonth,
    pay_year: defaultYear,
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

  // Helper functions for strict validation
  const isFuturePeriod = (y, m) => {
    if (y > currentYearValue) return true;
    if (y === currentYearValue && m > currentMonth) return true;
    return false;
  };

  const isInvalidCurrentMonth = (y, m) => {
    return (
      y === currentYearValue && m === currentMonth && !isLastDayOfCurrentMonth
    );
  };

  // Dynamically calculate valid years. We no longer restrict strictly to currentYear - 2.
  // Instead, we just need the user to be able to select the current year or the previous year
  // (to cover January payrolls generated in the new year).
  const validYears = [currentYearValue - 1, currentYearValue];

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

  // When year changes, if the current month selection becomes invalid, reset it to the closest valid month
  useEffect(() => {
    if (
      isFuturePeriod(formData.pay_year, formData.pay_month) ||
      isInvalidCurrentMonth(formData.pay_year, formData.pay_month)
    ) {
      setFormData((prev) => ({
        ...prev,
        pay_month: isLastDayOfCurrentMonth
          ? currentMonth
          : currentMonth === 1
            ? 12
            : currentMonth - 1,
      }));
    }
  }, [formData.pay_year, currentMonth, isLastDayOfCurrentMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPeriod = formData.pay_year * 100 + formData.pay_month;
    const currentPeriod = currentYearValue * 100 + currentMonth;

    // Future months are never allowed
    if (selectedPeriod > currentPeriod) {
      setError("Payroll cannot be generated for a future month.");
      return;
    }

    // Current month only on the last day
    if (selectedPeriod === currentPeriod && !isLastDayOfCurrentMonth) {
      setError(
        `Payroll can be generated only on the last date of ${monthNames[currentMonth - 1]}.`,
      );
      return;
    }

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
          <div>
            <GovSelect
              id="pay_month"
              label="Payroll Month"
              value={formData.pay_month}
              onChange={(e) =>
                setFormData({ ...formData, pay_month: Number(e.target.value) })
              }
              options={monthNames.map((name, i) => {
                const m = i + 1;
                // If it's a future month OR it's the current month but not the last day, disable it.
                // However, we only disable future months for the CURRENT year. If the user selects a previous year, all months are valid.
                const isDisabled =
                  isFuturePeriod(formData.pay_year, m) ||
                  isInvalidCurrentMonth(formData.pay_year, m);

                return {
                  value: m,
                  label: name,
                  disabled: isDisabled,
                };
              })}
              required
              disabled={loading}
            />
            {!isLastDayOfCurrentMonth &&
              formData.pay_year === currentYearValue && (
                <p className="text-xs text-amber-700 mt-1">
                  Payroll for the current month unlocks on the last date of{" "}
                  <strong>{monthNames[currentMonth - 1]}</strong>.
                </p>
              )}
          </div>
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
            disabled={
              loading ||
              structures.length === 0 ||
              isFuturePeriod(formData.pay_year, formData.pay_month) ||
              isInvalidCurrentMonth(formData.pay_year, formData.pay_month)
            }
          >
            {loading ? "Initializing..." : "Create Run Shell"}
          </GovButton>
        </div>
      </form>
    </GovModal>
  );
}
