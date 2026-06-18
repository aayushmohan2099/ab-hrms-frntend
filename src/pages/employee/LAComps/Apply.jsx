// src/pages/employee/LAComps/Apply.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceService } from "../../../api/attendanceService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovInput } from "../../../components/ui/GovInput";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSeparator } from "../../../components/ui/GovSeparator";
import { ArrowLeft, Send } from "lucide-react";

export function ApplyLeave() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    leave_type: "CASUAL",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic frontend validation
    const today = new Date().toISOString().split("T")[0];
    if (formData.start_date < today) {
      setError("Start date cannot be in the past.");
      setLoading(false);
      return;
    }

    if (formData.end_date < formData.start_date) {
      setError("End date must be after or equal to the start date.");
      setLoading(false);
      return;
    }

    try {
      await attendanceService.applyForLeave(formData);
      alert("Leave application submitted successfully!");
      navigate("/employee/LeaveApplication");
    } catch (err) {
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data?.start_date?.[0] ||
        err.response?.data?.end_date?.[0] ||
        "Failed to submit leave application. Please check your inputs.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date formatted for HTML date input minimum
  const todayDateStr = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate("/employee/LeaveApplication")}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Apply for Leave</h2>
          <p className="text-sm text-gray-500">
            Submit a new leave request for approval.
          </p>
        </div>
      </div>

      <GovCard>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-danger text-sm rounded border border-red-200 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <GovSelect
                id="leave_type"
                label="Leave Type"
                value={formData.leave_type}
                onChange={handleChange}
                required
                options={[
                  { value: "CASUAL", label: "Casual Leave (CL)" },
                  // { value: "MATERNITY", label: "Maternity Leave (ML)" },
                  { value: "SICK", label: "Sick Leave (SL)" },
                ]}
              />
            </div>

            <GovInput
              id="start_date"
              type="date"
              label="Start Date"
              min={todayDateStr}
              value={formData.start_date}
              onChange={handleChange}
              required
            />

            <GovInput
              id="end_date"
              type="date"
              label="End Date"
              min={formData.start_date || todayDateStr}
              value={formData.end_date}
              onChange={handleChange}
              required
            />

            <div className="md:col-span-2">
              <label
                htmlFor="reason"
                className="text-sm font-semibold text-gray-700 block mb-1.5"
              >
                Reason for Leave
              </label>
              <textarea
                id="reason"
                className="w-full px-3 py-2 bg-base border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-dark focus:border-primary-dark transition-colors min-h-[120px]"
                placeholder="Briefly describe the reason for your leave..."
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <GovSeparator />

          <div className="flex justify-end gap-4 pt-2">
            <GovButton
              type="button"
              variant="outline"
              onClick={() => navigate("/employee/LeaveApplication")}
              disabled={loading}
            >
              Cancel
            </GovButton>
            <GovButton
              type="submit"
              variant="primary"
              className="gap-2"
              disabled={loading}
            >
              <Send size={16} />
              {loading ? "Submitting..." : "Submit Application"}
            </GovButton>
          </div>
        </form>
      </GovCard>
    </div>
  );
}
