// src/pages/manager/AttenComps/BulkUploadAtten.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceService } from "../../../api/attendanceService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovButton } from "../../../components/ui/GovButton";
import { ArrowLeft, UploadCloud, Download, Info } from "lucide-react";

export function BulkUploadAtten() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownloadTemplate = () => {
    attendanceService.downloadBulkUploadTemplate();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first.");

    setLoading(true);
    setResult(null);

    try {
      const response = await attendanceService.bulkUploadAttendance(file);
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
          "Upload failed. Please check file format.",
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
            Override daily attendance statuses via CSV.
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-colors relative cursor-pointer">
                <UploadCloud size={40} className="text-primary-light mb-3" />
                <span className="text-sm font-semibold text-gray-700">
                  Click or drag CSV here
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
                  <ul className="mt-2 text-xs text-danger list-disc pl-4 space-y-1">
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
              <h3 className="font-bold">Formatting Rules</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              The CSV must contain exactly these 3 headers. Dates must be
              strictly <strong>YYYY-MM-DD</strong>.
            </p>
            <ul className="text-sm font-mono text-gray-600 bg-white p-3 rounded border border-gray-200 mb-4">
              <li>employee_code</li>
              <li>date_YYYY_MM_DD</li>
              <li>status_code</li>
            </ul>
            <p className="text-xs text-gray-500 mb-4">
              <strong>Valid Status Codes:</strong> PRESENT, ABSENT, WEEKEND,
              HOLIDAY, MATERNITY_LEAVE, CASUAL_LEAVE, SICK_LEAVE.
            </p>
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
