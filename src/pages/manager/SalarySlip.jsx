// src/pages/manager/SalarySlip.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { SalSlipService } from "../../api/SalSlipService";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import { GovBadge } from "../../components/ui/GovBadge";
import { GovModal } from "../../components/ui/GovModal";
import { GovSeparator } from "../../components/ui/GovSeparator";
import {
  GovTable,
  GovTableHeader,
  GovTableRow,
  GovTableCell,
} from "../../components/ui/GovTable";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import HeaderImage from "../../assets/ABSalHeader.png";

export function ManagerSalarySlips() {
  const { user } = useAuth();

  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 15;

  // Preview state
  const [previewSlip, setPreviewSlip] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [fetchingPreview, setFetchingPreview] = useState(false);

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

  useEffect(() => {
    // Only fetch if we have a valid department_id from the logged-in manager
    if (user?.department_id) {
      fetchSlips();
    } else {
      setLoading(false);
      setError("Department access restricted or not found.");
    }
  }, [currentPage, user]);

  const fetchSlips = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass the manager's department_id to filter the API request
      const data = await SalSlipService.getSalarySlipList(
        currentPage,
        pageSize,
        {
          department_id: user.department_id,
        },
      );
      setSlips(data.results || []);
      setTotalRecords(data.count || 0);
      setTotalPages(Math.ceil((data.count || 0) / pageSize) || 1);
    } catch (err) {
      console.error("Failed to fetch salary slips:", err);
      setError(
        "Unable to load department salary slips. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (slip) => {
    try {
      await SalSlipService.downloadSalarySlip(
        slip.employee_code,
        slip.slip_year,
        slip.slip_month,
      );
    } catch (err) {
      alert("Failed to download the salary slip.");
    }
  };

  const handlePreview = async (slip) => {
    setShowPreview(true);
    setFetchingPreview(true);
    setPreviewSlip(null);
    try {
      // Fetch full details of the slip for preview
      const data = await SalSlipService.generateSalarySlip(
        slip.employee_code,
        slip.slip_year,
        slip.slip_month,
      );
      // Attach month and year for rendering
      data.slip_month = slip.slip_month;
      data.slip_year = slip.slip_year;
      setPreviewSlip(data);
    } catch (err) {
      console.error("Failed to fetch preview:", err);
      alert("Failed to load salary slip preview.");
      setShowPreview(false);
    } finally {
      setFetchingPreview(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toUpperCase()) {
      case "GENERATED":
        return "success";
      case "DISPATCHED":
        return "primary";
      case "DRAFT":
      default:
        return "neutral";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-primary-dark" size={24} />
            Department Salary Slips
          </h2>
          <p className="text-sm text-gray-500">
            View and download historical salary records for your team.
          </p>
        </div>
      </div>

      <GovCard className="p-0 overflow-hidden border-gray-200">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-700">Team Salary Directory</h3>
          <span className="text-sm text-gray-500 font-medium">
            Total Records: {totalRecords}
          </span>
        </div>

        {error ? (
          <div className="p-8 text-center text-danger font-medium">{error}</div>
        ) : loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-primary-dark rounded-full animate-spin"></div>
          </div>
        ) : slips.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No salary slips have been generated for your department yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <GovTable className="border-0">
              <GovTableHeader>
                <GovTableCell isHeader>Slip Number</GovTableCell>
                <GovTableCell isHeader>Employee</GovTableCell>
                <GovTableCell isHeader>Period</GovTableCell>
                <GovTableCell isHeader>Net Pay</GovTableCell>
                <GovTableCell isHeader>Status</GovTableCell>
                <GovTableCell isHeader>Generated By</GovTableCell>
                <GovTableCell isHeader>Generated At</GovTableCell>
                <GovTableCell isHeader className="text-right">
                  Actions
                </GovTableCell>
              </GovTableHeader>
              <tbody>
                {slips.map((slip) => (
                  <GovTableRow key={slip.id}>
                    <GovTableCell className="font-mono text-xs font-medium text-gray-600">
                      {slip.slip_number}
                    </GovTableCell>
                    <GovTableCell>
                      <div className="font-medium text-gray-800">
                        {slip.employee_name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {slip.employee_code} • {slip.department_name}
                      </div>
                    </GovTableCell>
                    <GovTableCell className="font-medium text-gray-700">
                      {monthNames[slip.slip_month - 1]} {slip.slip_year}
                    </GovTableCell>
                    <GovTableCell className="font-semibold text-green-700">
                      {/* Note: In list view, backend might still send raw float. Using format here if needed */}
                      ₹
                      {parseFloat(slip.net_pay || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </GovTableCell>
                    <GovTableCell>
                      <GovBadge variant={getStatusVariant(slip.status)}>
                        {slip.status}
                      </GovBadge>
                    </GovTableCell>
                    <GovTableCell className="text-sm text-gray-600">
                      {slip.generated_by_name}
                    </GovTableCell>
                    <GovTableCell className="text-xs text-gray-500">
                      {slip.generated_at
                        ? new Date(slip.generated_at).toLocaleString()
                        : "N/A"}
                    </GovTableCell>
                    <GovTableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <GovButton
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handlePreview(slip)}
                        >
                          <Eye size={14} /> Preview
                        </GovButton>
                        <GovButton
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownload(slip)}
                        >
                          <Download size={14} /> PDF
                        </GovButton>
                      </div>
                    </GovTableCell>
                  </GovTableRow>
                ))}
              </tbody>
            </GovTable>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing page <span className="font-bold">{currentPage}</span> of{" "}
              <span className="font-bold">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <GovButton
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft size={16} /> Prev
              </GovButton>
              <GovButton
                variant="secondary"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next <ChevronRight size={16} />
              </GovButton>
            </div>
          </div>
        )}
      </GovCard>

      {/* Structured Salary Slip Preview Modal */}
      <GovModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Salary Slip Preview"
        className="max-w-5xl"
      >
        {fetchingPreview ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader2
              className="animate-spin text-primary-dark mb-4"
              size={40}
            />
            <p className="text-gray-500 font-medium">Generating Preview...</p>
          </div>
        ) : previewSlip ? (
          <div className="bg-white p-2 sm:p-6 rounded-md">
            <div className="w-full h-24 mb-6 flex items-center justify-center">
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
              WAGE SLIP FOR THE MONTH OF{" "}
              {monthNames[previewSlip.slip_month - 1].toUpperCase()}{" "}
              {previewSlip.slip_year}
            </h3>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-800 mb-8 px-2 sm:px-6">
              <div className="grid grid-cols-[110px_10px_1fr] gap-y-2">
                <span className="font-bold">Company Name</span>
                <span>:</span>
                <span className="font-bold">A B ENTERPRISE</span>
                <span className="font-bold">Employee Name</span>
                <span>:</span>
                <span>{previewSlip.employee_name_snapshot}</span>
                <span className="font-bold">Designation</span>
                <span>:</span>
                <span>{previewSlip.designation_snapshot}</span>
                <span className="font-bold">UAN No.</span>
                <span>:</span>
                <span>{previewSlip.uan_snapshot || "NA"}</span>
                <span className="font-bold">Date Generated</span>
                <span>:</span>
                <span>
                  {new Date().toLocaleDateString("en-GB").replace(/\//g, ".")}
                </span>
              </div>
              <div className="grid grid-cols-[110px_10px_1fr] gap-y-2">
                <span className="font-bold">Work Place</span>
                <span>:</span>
                <span>{previewSlip.department_snapshot}</span>
                <span className="font-bold">Address</span>
                <span>:</span>
                <span>{previewSlip.department_description}</span>
                <span className="font-bold">Theme</span>
                <span>:</span>
                <span>{previewSlip.employee_theme}</span>
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
                    <td className="border border-slate-300 p-3">Prs. Days</td>
                    <td className="border border-slate-300 p-3 text-right">
                      {previewSlip.days_present}
                    </td>
                    <td className="border border-slate-300 p-3">Basic</td>
                    <td className="border border-slate-300 p-3 text-right">
                      {previewSlip.monthly_honorarium}
                    </td>
                    <td className="border border-slate-300 p-3">
                      P. Fund (12%)
                    </td>
                    <td className="border border-slate-300 p-3 text-right">
                      {previewSlip.epf_amount}
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
                      {previewSlip.esic_amount}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-3"></td>
                    <td className="border border-slate-300 p-3 text-right"></td>
                    <td className="border border-slate-300 p-3"></td>
                    <td className="border border-slate-300 p-3 text-right"></td>
                    <td className="border border-slate-300 p-3">TDS (10%)</td>
                    <td className="border border-slate-300 p-3 text-right">
                      {previewSlip.tds_amount}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="border border-slate-300 p-3 py-4">
                      Total Days
                    </td>
                    <td className="border border-slate-300 p-3 py-4 text-right">
                      {previewSlip.total_working_days}
                    </td>
                    <td className="border border-slate-300 p-3 py-4">
                      Total Earnings
                    </td>
                    <td className="border border-slate-300 p-3 py-4 text-right">
                      {previewSlip.gross_pay}
                    </td>
                    <td className="border border-slate-300 p-3 py-4">
                      Total Ded.
                    </td>
                    <td className="border border-slate-300 p-3 py-4 text-right">
                      {previewSlip.total_deductions}
                    </td>
                    <td className="border border-slate-300 p-3 py-4 text-right text-green-700 text-base">
                      {previewSlip.net_pay}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net Pay in Words */}
            <div className="px-2 sm:px-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded p-4 text-sm text-green-900">
                <span className="font-bold">Net Pay in words:</span>{" "}
                {previewSlip.net_pay_words}
              </div>
            </div>

            <p className="text-xs text-center text-gray-500 italic mb-4">
              This is a system-generated salary slip and does not require a
              signature.
            </p>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No preview available.
          </div>
        )}
      </GovModal>
    </div>
  );
}

export default ManagerSalarySlips;
