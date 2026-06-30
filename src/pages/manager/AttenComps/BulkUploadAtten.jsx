// src/pages/manager/AttenComps/BulkUploadAtten.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceService } from "../../../api/attendanceService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovButton } from "../../../components/ui/GovButton";
import { GovSelect } from "../../../components/ui/GovSelect";
import { ArrowLeft, UploadCloud, Download, Info } from "lucide-react";

export function BulkUploadAtten() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Month and Year selection state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(
    Math.min(Math.max(new Date().getFullYear(), 2025), 2026),
  );

  const validYears = [2025, 2026];
  const monthNames = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const handleDownloadTemplate = () => {
    attendanceService.downloadBulkUploadTemplate(selectedMonth, selectedYear);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first.");

    setLoading(true);
    setResult(null);

    try {
      const response = await attendanceService.bulkUploadAttendance(
        file,
        selectedMonth,
        selectedYear,
      );
      setResult({
        success: true,
        message: response.detail,
        errors: response.errors,
      });
    } catch (err) {
      setResult({
        success: false,
        message:
          err.response?.data?.detail ||
          "Upload failed. Please check file format and code mapping.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate("/manager/attendance")}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Bulk Upload Attendance
          </h2>
          <p className="text-sm text-gray-500">
            Override daily attendance statuses using the monthly matrix
            template.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Upload */}
        <div className="space-y-6">
          <GovCard>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
              Upload Data File
            </h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <GovSelect
                  label="Target Year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  options={validYears.map((y) => ({
                    value: y,
                    label: y.toString(),
                  }))}
                  required
                />
                <GovSelect
                  label="Target Month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  options={monthNames}
                  required
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-colors relative cursor-pointer mt-4">
                <UploadCloud size={40} className="text-primary-light mb-3" />
                <span className="text-sm font-semibold text-gray-700">
                  Click or drag CSV matrix here
                </span>
                <input
                  type="file"
                  accept=".csv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              {file && (
                <div className="bg-green-50 p-3 rounded border border-green-200 text-sm font-medium text-green-800 break-all">
                  Selected: {file.name}
                </div>
              )}

              <GovButton
                type="submit"
                variant="primary"
                className="w-full gap-2"
                disabled={loading}
              >
                <UploadCloud size={16} />{" "}
                {loading ? "Processing..." : "Process Upload"}
              </GovButton>
            </form>

            {/* Result Display */}
            {result && (
              <div
                className={`mt-4 p-4 rounded border ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <p
                  className={`font-bold ${result.success ? "text-green-800" : "text-danger"}`}
                >
                  {result.message}
                </p>
                {result.errors && result.errors.length > 0 && (
                  <ul className="mt-2 text-xs text-danger list-disc pl-4 space-y-1 max-h-40 overflow-y-auto font-mono">
                    {result.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </GovCard>
        </div>

        {/* Right Column: Instructions */}
        <div className="space-y-6">
          <GovCard className="bg-blue-50 border-blue-200">
            <div className="flex gap-3 mb-2 text-primary-dark">
              <Info size={20} />
              <h3 className="font-bold">Matrix Formatting Rules</h3>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              Select your Target Year and Month, then download the pre-filled
              template. The CSV must maintain the exact structure generated by
              the template:
            </p>

            <div className="overflow-x-auto">
              <table className="text-xs font-mono text-gray-600 bg-white border border-gray-200 mb-4 w-full text-center">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="p-2 border-r">S.no</th>
                    <th className="p-2 border-r">employee_code</th>
                    <th className="p-2 border-r">1</th>
                    <th className="p-2 border-r">2</th>
                    <th className="p-2 border-r">3</th>
                    <th className="p-2">...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-r">1</td>
                    <td className="p-2 border-r">AB-TEST-001</td>
                    <td className="p-2 border-r font-bold text-green-600">P</td>
                    <td className="p-2 border-r font-bold text-red-500">A</td>
                    <td className="p-2 border-r font-bold text-blue-600">EL</td>
                    <td className="p-2">...</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-800 font-semibold mb-2">
              Valid Daily Codes:
            </p>
            <ul className="text-xs text-gray-600 grid grid-cols-2 gap-2 mb-4 bg-white p-3 rounded border border-gray-200">
              <li>
                <strong className="text-gray-900">P</strong> : Present
              </li>
              <li>
                <strong className="text-gray-900">A</strong> : Absent
              </li>
              <li>
                <strong className="text-gray-900">EL</strong> : Earned Leave
              </li>
              <li>
                <strong className="text-gray-900">CL</strong> : Casual Leave
              </li>
              <li>
                <strong className="text-gray-900">SL</strong> : Sick Leave
              </li>
              <li>
                <strong className="text-gray-900">LWP</strong> : Leave W/O Pay
              </li>
              <li>
                <strong className="text-gray-900">ESL</strong> : Ext. Sick Leave
              </li>
            </ul>

            <GovButton
              variant="outline"
              size="sm"
              className="w-full gap-2 bg-white"
              onClick={handleDownloadTemplate}
            >
              <Download size={14} /> Download Template
            </GovButton>
          </GovCard>
        </div>
      </div>
    </div>
  );
}
