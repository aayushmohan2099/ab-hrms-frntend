// src/pages/admin/TDSFormComps/UploadTDSForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios"; // Directly importing axios to attach onUploadProgress securely
import { GovCard } from "../../../components/ui/GovCard";
import { GovSelect } from "../../../components/ui/GovSelect";
import { GovInput } from "../../../components/ui/GovInput";
import { GovButton } from "../../../components/ui/GovButton";
import { GovModal } from "../../../components/ui/GovModal";
import { GovProgressBar } from "../../../components/ui/GovProgressBar";
import { GovSeparator } from "../../../components/ui/GovSeparator";
import {
  ArrowLeft,
  UploadCloud,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { EmpList } from "../EmpList"; // Embedded employee list for reference

export function UploadTDSForm() {
  const navigate = useNavigate();

  const [financialYear, setFinancialYear] = useState("");
  const [quarter, setQuarter] = useState("");
  const [zipFile, setZipFile] = useState(null);

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  const financialYears = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];
  const quarters = [
    { value: "Q1", label: "Quarter 1" },
    { value: "Q2", label: "Quarter 2" },
    { value: "Q3", label: "Quarter 3" },
    { value: "Q4", label: "Quarter 4" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.toLowerCase().endsWith(".zip")) {
      alert("Please upload a valid .zip file.");
      e.target.value = "";
      setZipFile(null);
      return;
    }
    setZipFile(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!zipFile || !financialYear || !quarter) {
      alert("Please provide the ZIP file, Financial Year, and Quarter.");
      return;
    }

    const formData = new FormData();
    formData.append("zip_file", zipFile);
    formData.append("financial_year", financialYear);
    formData.append("quarter", quarter);

    setShowProgressModal(true);
    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const response = await api.post(
        "/form-16/tds-forms/bulk-upload-zip/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      setUploadResult({
        success: true,
        data: response.data,
      });
    } catch (err) {
      setUploadResult({
        success: false,
        error:
          err.response?.data?.error ||
          "A server error occurred during the upload process.",
        errorsList: err.response?.data?.errors || [],
      });
    } finally {
      setUploading(false);
    }
  };

  const closeAndReset = () => {
    setShowProgressModal(false);
    setUploadResult(null);
    setUploadProgress(0);
    if (uploadResult?.success) {
      // Clear form on success
      setZipFile(null);
      document.getElementById("zip_file").value = "";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate("/admin/form-16")}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Bulk Upload TDS ZIP
          </h2>
          <p className="text-sm text-gray-500">
            Automatically distribute Form 16 PDFs to employees via a compressed
            archive.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload Form & Instructions */}
        <div className="lg:col-span-1 space-y-6">
          <GovCard className="border-t-4 border-t-primary-dark">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Upload Configuration
            </h3>
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <GovSelect
                id="financial_year"
                label="Financial Year"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                required
                options={[
                  { value: "", label: "-- Select Year --" },
                  ...financialYears.map((y) => ({ value: y, label: y })),
                ]}
              />

              <GovSelect
                id="quarter"
                label="Quarter"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                required
                options={[
                  { value: "", label: "-- Select Quarter --" },
                  ...quarters,
                ]}
              />

              <GovInput
                id="zip_file"
                type="file"
                accept=".zip"
                label="TDS Archive (.zip)"
                onChange={handleFileChange}
                required
              />

              <GovButton
                type="submit"
                variant="primary"
                className="w-full gap-2"
                disabled={!zipFile || !financialYear || !quarter}
              >
                <UploadCloud size={18} /> Process ZIP File
              </GovButton>
            </form>
          </GovCard>

          {/* Instructions Box */}
          <GovCard className="bg-blue-50/50 border-blue-200">
            <div className="flex gap-3 mb-3 text-primary-dark items-center">
              <Info size={20} />
              <h3 className="font-bold text-lg">Formatting Rules</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-3 list-disc pl-5">
              <li>
                Every PDF file inside the ZIP <strong>MUST</strong> be named
                exactly with the corresponding <strong>Employee Code</strong>.
              </li>
              <li>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs text-danger">
                  Example: AB-IT-001.pdf
                </span>
              </li>
              <li>
                Files that do not match an active employee code will be
                automatically skipped.
              </li>
              <li>
                Do not place the PDFs inside a sub-folder within the ZIP.
                Compress the PDF files directly.
              </li>
            </ul>
          </GovCard>
        </div>

        {/* Right Column: Embedded Employee Reference List */}
        <div className="lg:col-span-2">
          <GovCard className="h-full flex flex-col p-0 overflow-hidden bg-gray-50 border border-gray-300 shadow-inner">
            <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between">
              <h3 className="font-bold text-gray-800">
                Employee Code Directory Reference
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Read Only View
              </span>
            </div>
            {/* We render the EmpList component inside a scrollable frame.
                This acts as a live lookup tool while the admin is naming their PDFs.
            */}
            <div className="flex-1 overflow-y-auto max-h-[700px] p-4 scale-[0.95] transform origin-top">
              <EmpList />
            </div>
          </GovCard>
        </div>
      </div>

      {/* Progress & Result Modal */}
      <GovModal
        isOpen={showProgressModal}
        onClose={uploading ? undefined : closeAndReset} // Prevent closing while uploading
        title="Processing TDS Archive"
        className="max-w-2xl"
      >
        <div className="p-6 space-y-6">
          {/* Active Uploading State */}
          {uploading && (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium text-center">
                {uploadProgress < 100
                  ? "Uploading secure archive to server..."
                  : "Upload complete. Extracting and mapping PDFs to employee accounts. Please wait..."}
              </p>
              <GovProgressBar
                value={uploadProgress}
                max={100}
                variant={uploadProgress < 100 ? "primary" : "warning"}
                size="lg"
                showValue={true}
              />
            </div>
          )}

          {/* Success State */}
          {!uploading && uploadResult?.success && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
              <CheckCircle2 size={64} className="text-green-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                Upload Successful
              </h3>
              <p className="text-gray-600 text-lg">
                Successfully processed{" "}
                <strong>{uploadResult.data.success_count}</strong> forms for FY{" "}
                {financialYear} ({quarter}).
              </p>

              {uploadResult.data.errors &&
                uploadResult.data.errors.length > 0 && (
                  <div className="w-full mt-6 text-left">
                    <GovSeparator className="mb-4" />
                    <p className="text-sm font-bold text-orange-600 flex items-center gap-2 mb-2">
                      <AlertCircle size={16} /> Skipped Files / Warnings:
                    </p>
                    <div className="bg-orange-50 border border-orange-200 rounded p-3 max-h-40 overflow-y-auto">
                      <ul className="list-disc pl-4 text-xs text-orange-800 space-y-1 font-mono">
                        {uploadResult.data.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              <GovButton
                variant="primary"
                onClick={closeAndReset}
                className="mt-4"
              >
                Acknowledge & Close
              </GovButton>
            </div>
          )}

          {/* Error State */}
          {!uploading && uploadResult?.success === false && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
              <AlertCircle size={64} className="text-danger" />
              <h3 className="text-2xl font-bold text-gray-900">
                Upload Failed
              </h3>
              <p className="text-danger font-medium">{uploadResult.error}</p>
              <GovButton
                variant="outline"
                onClick={closeAndReset}
                className="mt-4"
              >
                Close & Try Again
              </GovButton>
            </div>
          )}
        </div>
      </GovModal>
    </div>
  );
}
