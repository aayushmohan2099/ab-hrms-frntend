// src/pages/employee/salarySlip.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { salaryService } from "../../api/salaryService";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import { GovSelect } from "../../components/ui/GovSelect";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import { GovSeparator } from "../../components/ui/GovSeparator";
import { Download, Search, AlertCircle } from "lucide-react";

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
      // NOTE: Ensure your Django backend is updated to return the serialized slip
      // fields in this JSON response so the table below can populate correctly.
      const data = await salaryService.generateSalarySlip(
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

          {/* Slip Content mapped to Python ReportLab Template */}
          <div className="mt-12 mb-6">
            <h3 className="text-xl font-bold text-center text-gray-900 uppercase tracking-wider mb-8">
              Wage Slip For the month of {monthName}-{year}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-800 mb-6 px-4">
              <div className="grid grid-cols-[120px_10px_1fr] gap-2">
                <span className="font-semibold">Company Name</span>
                <span>:</span>
                <span>A B ENTERPRISE</span>

                <span className="font-semibold">Employee Name</span>
                <span>:</span>
                <span>
                  {slipData.employee_name_snapshot || user?.first_name}
                </span>

                <span className="font-semibold">UAN No.</span>
                <span>:</span>
                <span>{slipData.uan_snapshot || "NA"}</span>

                <span className="font-semibold">ESIC No.</span>
                <span>:</span>
                <span>NA</span>
              </div>
              <div className="grid grid-cols-[120px_10px_1fr] gap-2">
                <span className="font-semibold">Work Place</span>
                <span>:</span>
                <span>{slipData.department_snapshot || "NA"}</span>

                <span className="font-semibold">Designation</span>
                <span>:</span>
                <span>{slipData.designation_snapshot || "NA"}</span>

                <span className="font-semibold">Date</span>
                <span>:</span>
                <span>{new Date().toLocaleDateString("en-GB")}</span>
              </div>
            </div>

            <GovSeparator className="my-6" />

            <GovTable className="border-collapse border border-gray-300">
              <GovTableHeader className="bg-gray-50 border-y border-gray-300">
                <GovTableCell isHeader className="border-r border-gray-300">
                  Days
                </GovTableCell>
                <GovTableCell
                  isHeader
                  className="border-r border-gray-300"
                ></GovTableCell>
                <GovTableCell isHeader className="border-r border-gray-300">
                  Allowance
                </GovTableCell>
                <GovTableCell isHeader className="border-r border-gray-300">
                  Rate
                </GovTableCell>
                <GovTableCell isHeader className="border-r border-gray-300">
                  Gross
                </GovTableCell>
                <GovTableCell isHeader className="border-r border-gray-300">
                  Deduction
                </GovTableCell>
                <GovTableCell
                  isHeader
                  className="border-r border-gray-300"
                ></GovTableCell>
                <GovTableCell isHeader>Net Pay</GovTableCell>
              </GovTableHeader>
              <tbody className="text-gray-800">
                <GovTableRow hover={false} className="border-b-0">
                  <GovTableCell className="font-medium border-r border-gray-300">
                    Prs. Days
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300 text-right">
                    {slipData.days_present || 0}
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300">
                    Basic
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300 text-right">
                    {slipData.monthly_honorarium || "0.00"}
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300">
                    P. Fund (12%)
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300 text-right">
                    {slipData.epf_amount || "0.00"}
                  </GovTableCell>
                  <GovTableCell></GovTableCell>
                </GovTableRow>
                <GovTableRow hover={false} className="border-b-0">
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300">
                    ESIC (0.75%)
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300 text-right">
                    {slipData.esic_amount || "0.00"}
                  </GovTableCell>
                  <GovTableCell></GovTableCell>
                </GovTableRow>
                <GovTableRow hover={false} className="border-b border-gray-300">
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300">
                    TDS (10%)
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300 text-right">
                    {slipData.tds_amount || "0.00"}
                  </GovTableCell>
                  <GovTableCell></GovTableCell>
                </GovTableRow>
                <GovTableRow
                  hover={false}
                  className="bg-gray-50 font-bold border-b border-gray-300"
                >
                  <GovTableCell className="border-r border-gray-300">
                    Total Days
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300 text-right">
                    {slipData.total_working_days || 0}
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300">
                    Total Earnings
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300"></GovTableCell>
                  <GovTableCell className="border-r border-gray-300 text-right">
                    {slipData.gross_pay || "0.00"}
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300">
                    Total Ded.
                  </GovTableCell>
                  <GovTableCell className="border-r border-gray-300 text-right">
                    {slipData.total_deductions || "0.00"}
                  </GovTableCell>
                  <GovTableCell className="text-right">
                    {slipData.net_pay || "0.00"}
                  </GovTableCell>
                </GovTableRow>
              </tbody>
            </GovTable>

            <p className="mt-8 text-sm text-center text-gray-500 italic">
              This is a system-generated salary slip and does not require a
              signature.
            </p>
          </div>
        </GovCard>
      )}
    </div>
  );
}
