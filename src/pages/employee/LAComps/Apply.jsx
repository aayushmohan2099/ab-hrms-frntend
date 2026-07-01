// src/pages/employee/LAComps/Apply.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { attendanceService } from "../../../api/attendanceService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovInput } from "../../../components/ui/GovInput";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSeparator } from "../../../components/ui/GovSeparator";
import {
  ArrowLeft,
  Send,
  Umbrella,
  BookOpen,
  CalendarDays,
  BriefcaseMedical,
  Award,
  AlertCircle,
  Info,
} from "lucide-react";

export function ApplyLeave() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for leave balances
  const [leaveBalances, setLeaveBalances] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  // Fetch leave balances on mount
  useEffect(() => {
    const fetchBalances = async () => {
      if (!user?.employee_code) return;
      try {
        const data = await attendanceService.getEmployeeLeaveBalance(
          user.employee_code,
        );
        setLeaveBalances(data);
      } catch (err) {
        console.error("Failed to fetch leave balances:", err);
      } finally {
        setBalanceLoading(false);
      }
    };
    fetchBalances();
  }, [user?.employee_code]);

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

  // Helper to dynamically build leave options based on remaining balance
  const getAvailableLeaveOptions = () => {
    if (balanceLoading) {
      return [{ value: "", label: "Loading leave types..." }];
    }

    const options = [{ value: "", label: "-- Select Leave Type --" }];
    const baseOptions = [
      { value: "EARNED", label: "Earned Leave (EL)" },
      { value: "SICK", label: "Sick Leave (SL)" },
      { value: "CASUAL", label: "Casual Leave (CL)" },
      { value: "LWP", label: "Leave Without Pay (LWP)" },
      { value: "MATERNITY", label: "Maternity Leave (ML)" },
    ];

    if (leaveBalances) {
      baseOptions.forEach((opt) => {
        const balanceStr = leaveBalances[opt.value];
        if (balanceStr) {
          // Extract the left side of "X / Y" (the remaining balance)
          const leftCount = parseInt(balanceStr.split("/")[0].trim(), 10);

          // Only add to dropdown if balance is greater than 0
          if (leftCount > 0) {
            options.push(opt);
          }
        }
      });
    }

    // Handle edge case where all leaves are exhausted
    if (options.length === 1 && !balanceLoading) {
      return [{ value: "", label: "-- All Leave Balances Exhausted --" }];
    }

    return options;
  };

  // Get today's date formatted for HTML date input minimum
  const todayDateStr = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/employee/LeaveApplication")}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600 transition-colors"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Application Form & Balances */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Leave Balance Summary Card */}
          <GovCard className="bg-blue-50/50 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Umbrella className="text-primary-dark" size={20} />
              <h3 className="font-bold text-primary-dark">
                Current Year Leave Balance
              </h3>
            </div>

            {balanceLoading ? (
              <div className="text-sm text-gray-500 animate-pulse">
                Loading balances...
              </div>
            ) : leaveBalances ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 mb-1">
                    TOTAL
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    {leaveBalances["TOTAL"]}
                  </span>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 mb-1">
                    EL
                  </span>
                  <span className="text-lg font-black text-blue-700">
                    {leaveBalances["EARNED"]}
                  </span>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 mb-1">
                    SL
                  </span>
                  <span className="text-lg font-black text-indigo-700">
                    {leaveBalances["SICK"]}
                  </span>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 mb-1">
                    CL
                  </span>
                  <span className="text-lg font-black text-yellow-600">
                    {leaveBalances["CASUAL"]}
                  </span>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 mb-1">
                    LWP
                  </span>
                  <span className="text-lg font-black text-red-600">
                    {leaveBalances["LWP"]}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-danger">
                Failed to load balances.
              </div>
            )}
          </GovCard>

          {/* Form Card */}
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
                    disabled={
                      balanceLoading || getAvailableLeaveOptions().length === 1
                    }
                    options={getAvailableLeaveOptions()}
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
                  disabled={loading || !formData.leave_type}
                >
                  <Send size={16} />
                  {loading ? "Submitting..." : "Submit Application"}
                </GovButton>
              </div>
            </form>
          </GovCard>
        </div>

        {/* Right Column: HR Policies Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4">
          <GovCard className="bg-gray-50/80 border border-gray-200 sticky top-6 max-h-[85vh] flex flex-col p-0 overflow-hidden shadow-md">
            <div className="p-5 border-b border-gray-200 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-primary-dark rounded-lg">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    HR Leave Policies
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    As per department regulations
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 text-sm text-gray-700 custom-scrollbar">
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-md flex items-start gap-2 text-primary-dark mb-2">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs font-medium">
                  Leave Year runs from{" "}
                  <strong>1st January to 31st December</strong>. No leaves will
                  be carried forward to the next calendar year.
                </p>
              </div>

              {/* Casual Leave */}
              <section>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2 pb-1 border-b border-gray-200">
                  <CalendarDays size={16} className="text-yellow-600" />
                  Casual Leave (CL)
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600 marker:text-gray-400">
                  <li>
                    Entitled to <strong>5 days</strong> every six months.
                  </li>
                  <li>
                    Maximum <strong>2 CLs</strong> can be availed consecutively.
                  </li>
                  <li>
                    Cannot be carried forward to the next six-month period.
                  </li>
                  <li>Timely intimation through the ICT system is required.</li>
                </ul>
              </section>

              {/* Earned Leave */}
              <section>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2 pb-1 border-b border-gray-200">
                  <Award size={16} className="text-blue-600" />
                  Earned Leave (EL)
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600 marker:text-gray-400">
                  <li>
                    Entitled to <strong>5 days</strong> every six months.
                  </li>
                  <li>
                    Can be carried forward to the next six-month period{" "}
                    <strong>within</strong> the Calendar year.
                  </li>
                </ul>
              </section>

              {/* Medical Leave */}
              <section>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2 pb-1 border-b border-gray-200">
                  <BriefcaseMedical size={16} className="text-indigo-600" />
                  Sick Leave (SL)
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600 marker:text-gray-400">
                  <li>
                    Entitled to <strong>10 days</strong> per year for illness.
                  </li>
                  <li>
                    Leaves exceeding <strong>3 days</strong> must be supported
                    by a medical certificate.
                  </li>
                  <li>
                    Fitness certificate required to resume work after long
                    medical leave.
                  </li>
                </ul>
              </section>

              {/* General Rules */}
              <section>
                <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2 pb-1 border-b border-gray-200">
                  <AlertCircle size={16} className="text-red-500" />
                  General & Special Rules
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600 marker:text-gray-400">
                  <li>
                    Leave accrues at <strong>2.5 days</strong> per working
                    month.
                  </li>
                  <li>
                    Maximum <strong>10 days</strong> leave may be availed in one
                    go (subject to approval).
                  </li>
                  <li>
                    <strong>Leave Without Pay (LWP):</strong> Max 30 days unpaid
                    leave allowed in extraordinary circumstances.
                  </li>
                  <li>
                    <strong>Unauthorized Absence:</strong> Leave availed without
                    prior approval will be treated as unauthorized absence
                    (unpaid).
                  </li>
                  <li>
                    There is <strong>no cash reimbursement</strong> for unused
                    leave.
                  </li>
                </ul>
              </section>
            </div>
          </GovCard>
        </div>
      </div>
    </div>
  );
}
