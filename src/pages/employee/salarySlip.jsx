// src/pages/employee/salarySlip.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { SalSlipService } from "../../api/SalSlipService";
import { attendanceService } from "../../api/attendanceService";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import { GovSelect } from "../../components/ui/GovSelect";
import { Download, Search, AlertCircle } from "lucide-react";
import HeaderImage from "../../assets/ABSalHeader.png";

export function SalarySlip() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [slipData, setSlipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Safely extract employee code (adjust based on your actual auth user object structure)
  const employeeCode = user?.employee_code || user?.username;

  const [hasPendingLeaves, setHasPendingLeaves] = useState(false);
  const [checkingLeaves, setCheckingLeaves] = useState(true);

  useEffect(() => {
    const checkPendingLeaves = async () => {
      try {
        const data = await attendanceService.getMyLeaveHistory(1, 100);
        const leaves = data.results || [];
        const pending = leaves.some((leave) => leave.status === "PENDING");
        setHasPendingLeaves(pending);
      } catch (err) {
        console.error("Failed to check leave status", err);
      } finally {
        setCheckingLeaves(false);
      }
    };
    checkPendingLeaves();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    label: String(currentYear - i),
    value: String(currentYear - i),
  }));

  const months = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const monthName = useMemo(() => {
    return months.find((m) => m.value === month)?.label || "";
  }, [month]);

  const handleFetch = async () => {
    if (!month || !year) {
      setError("Please select both month and year.");
      return;
    }
    if (!employeeCode) {
      setError("Employee code not found in session.");
      return;
    }

    setLoading(true);
    setError("");
    setSlipData(null);

    try {
      const data = await SalSlipService.generateSalarySlip(
        employeeCode,
        year,
        month,
      );
      setSlipData(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to fetch salary slip for this month.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToDownload = () => {
    navigate("/employee/salary-slips/download", {
      state: { month, year, employeeCode },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Salary Slips</h2>
      </div>

      {checkingLeaves ? (
        <div className="p-12 text-center text-gray-500 animate-pulse font-medium">
          Verifying attendance clearance...
        </div>
      ) : hasPendingLeaves ? (
        <GovCard className="bg-orange-50 border-orange-200">
          <div className="flex items-start gap-4 text-orange-800 p-2">
            <AlertCircle size={32} className="mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-xl mb-1">
                Action Blocked: Pending Leaves
              </h3>
              <p className="text-sm mt-1 text-orange-800/80 leading-relaxed">
                You currently have <strong>PENDING</strong> leave applications.
                Salary slips cannot be generated or downloaded until your
                manager has approved or rejected all your pending leaves to
                finalize the attendance records.
              </p>
              <GovButton
                variant="outline"
                size="sm"
                className="mt-4 border-orange-300 text-orange-800 hover:bg-orange-100"
                onClick={() => navigate("/employee/LeaveApplication")}
              >
                View My Leave Applications
              </GovButton>
            </div>
          </div>
        </GovCard>
      ) : (
        <>
          <GovCard className="bg-white">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="w-full sm:w-1/3">
                <GovSelect
                  label="Select Year"
                  id="year-select"
                  options={[{ label: "Select Year...", value: "" }, ...years]}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-1/3">
                <GovSelect
                  label="Select Month"
                  id="month-select"
                  options={[{ label: "Select Month...", value: "" }, ...months]}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>
              <GovButton
                onClick={handleFetch}
                disabled={loading}
                className="w-full sm:w-auto gap-2"
              >
                <Search size={18} />
                {loading ? "Fetching..." : "Fetch Slip"}
              </GovButton>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-danger border border-red-200 rounded flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </GovCard>

          {slipData && (
            <GovCard className="relative overflow-hidden bg-white shadow-md border-gray-300">
              {/* Action Bar */}
              <div className="absolute top-4 right-4 z-10">
                <GovButton
                  variant="primary"
                  size="sm"
                  onClick={handleRedirectToDownload}
                  className="gap-2 shadow-sm"
                >
                  <Download size={16} /> Download PDF
                </GovButton>
              </div>

              {/* Structured Slip Content matching the PDF output */}
              <div className="bg-white p-2 sm:p-6 rounded-md mt-10">
                {/* Header Image replacing the title/placeholder */}
                <div className="mb-6 flex justify-center w-full">
                  <img
                    src={HeaderImage}
                    alt="A B Enterprise Header"
                    className="w-full max-w-[535px] h-auto object-contain pointer-events-none select-none"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.insertAdjacentHTML(
                        "afterend",
                        '<div class="w-full bg-blue-50 border border-blue-100 h-24 mb-6 rounded flex items-center justify-center text-blue-300"><span class="font-semibold text-sm tracking-widest">[ HEADER IMAGE PLACEHOLDER ]</span></div>',
                      );
                    }}
                  />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-center text-[#1e3a8a] uppercase tracking-wider mb-8">
                  WAGE SLIP FOR THE MONTH OF {monthName.toUpperCase()} {year}
                </h3>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-800 mb-8 px-2 sm:px-6">
                  <div className="grid grid-cols-[110px_10px_1fr] gap-y-2">
                    <span className="font-bold">Company Name</span>
                    <span>:</span>
                    <span className="font-bold">A B ENTERPRISE</span>
                    <span className="font-bold">Employee Name</span>
                    <span>:</span>
                    <span>{slipData.employee_name_snapshot}</span>
                    <span className="font-bold">Designation</span>
                    <span>:</span>
                    <span>{slipData.designation_snapshot}</span>
                    <span className="font-bold">UAN No.</span>
                    <span>:</span>
                    <span>{slipData.uan_snapshot || "NA"}</span>
                    <span className="font-bold">Date Generated</span>
                    <span>:</span>
                    <span>
                      {new Date()
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, ".")}
                    </span>
                  </div>
                  <div className="grid grid-cols-[110px_10px_1fr] gap-y-2">
                    <span className="font-bold">Work Place</span>
                    <span>:</span>
                    <span>{slipData.department_snapshot}</span>
                    <span className="font-bold">Address</span>
                    <span>:</span>
                    <span>{slipData.department_description || "NA"}</span>
                    <span className="font-bold">Theme</span>
                    <span>:</span>
                    <span>{slipData.employee_theme || "NA"}</span>
                    <span className="font-bold">ESIC No.</span>
                    <span>:</span>
                    <span>NA</span>
                  </div>
                </div>

                {/* Structured Wage Table */}
                <div className="px-2 sm:px-6 mb-8 overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-slate-300">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="border border-slate-300 p-3 text-left">
                          Days
                        </th>
                        <th className="border border-slate-300 p-3 text-right">
                          Count
                        </th>
                        <th className="border border-slate-300 p-3 text-left">
                          Allowance
                        </th>
                        <th className="border border-slate-300 p-3 text-right">
                          Gross
                        </th>
                        <th className="border border-slate-300 p-3 text-left">
                          Deduction
                        </th>
                        <th className="border border-slate-300 p-3 text-right">
                          Amount
                        </th>
                        <th className="border border-slate-300 p-3 text-right">
                          Net Pay
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-3">
                          Prs. Days
                        </td>
                        <td className="border border-slate-300 p-3 text-right">
                          {slipData.days_present}
                        </td>
                        <td className="border border-slate-300 p-3">Basic</td>
                        <td className="border border-slate-300 p-3 text-right">
                          {slipData.monthly_honorarium}
                        </td>
                        <td className="border border-slate-300 p-3">
                          P. Fund (12%)
                        </td>
                        <td className="border border-slate-300 p-3 text-right">
                          {slipData.epf_amount}
                        </td>
                        <td
                          className="border border-slate-300 p-3 text-right"
                          rowSpan="3"
                        ></td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-3"></td>
                        <td className="border border-slate-300 p-3 text-right"></td>
                        <td className="border border-slate-300 p-3"></td>
                        <td className="border border-slate-300 p-3 text-right"></td>
                        <td className="border border-slate-300 p-3">
                          ESIC (0.75%)
                        </td>
                        <td className="border border-slate-300 p-3 text-right">
                          {slipData.esic_amount}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-3"></td>
                        <td className="border border-slate-300 p-3 text-right"></td>
                        <td className="border border-slate-300 p-3"></td>
                        <td className="border border-slate-300 p-3 text-right"></td>
                        <td className="border border-slate-300 p-3">
                          TDS (10%)
                        </td>
                        <td className="border border-slate-300 p-3 text-right">
                          {slipData.tds_amount}
                        </td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="border border-slate-300 p-3 py-4">
                          Total Days
                        </td>
                        <td className="border border-slate-300 p-3 py-4 text-right">
                          {slipData.total_working_days}
                        </td>
                        <td className="border border-slate-300 p-3 py-4">
                          Total Earnings
                        </td>
                        <td className="border border-slate-300 p-3 py-4 text-right">
                          {slipData.gross_pay}
                        </td>
                        <td className="border border-slate-300 p-3 py-4">
                          Total Ded.
                        </td>
                        <td className="border border-slate-300 p-3 py-4 text-right">
                          {slipData.total_deductions}
                        </td>
                        <td className="border border-slate-300 p-3 py-4 text-right text-green-700 text-base">
                          {slipData.net_pay}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Net Pay in Words */}
                <div className="px-2 sm:px-6 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded p-4 text-sm text-green-900">
                    <span className="font-bold">Net Pay in words:</span>{" "}
                    {slipData.net_pay_words}
                  </div>
                </div>

                <p className="text-xs text-center text-gray-500 italic mb-4">
                  This is a system-generated salary slip and does not require a
                  signature.
                </p>
              </div>
            </GovCard>
          )}
        </>
      )}
    </div>
  );
}
