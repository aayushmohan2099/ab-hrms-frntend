// src/components/admin/EmpComps/EmpCreator.jsx
import { useState } from "react";
import * as XLSX from "xlsx";
import { GovCard } from "../../../components/ui/GovCard";
import { GovButton } from "../../../components/ui/GovButton";
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

export function EmpCreator() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, processing, complete, error
  const [totalCount, setTotalCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setProcessedCount(0);
      setTotalCount(0);
      setErrorMessage("");
    }
  };

  const processBulkUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setStatus("processing");
    setErrorMessage("");
    const formData = new FormData();
    formData.append("file", file);

    // Grab the token for native fetch request
    const token = localStorage.getItem("access_token");
    const processedRows = [];

    try {
      // CRITICAL FIX: URL changed to match Django's path('bulk-create/', ...)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/employees/bulk-create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported by the browser.");
      }

      // Process the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        // Pop the last element back into the buffer because it might be incomplete
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;

          const data = JSON.parse(line);

          if (data.error && status === "idle") {
            throw new Error(data.error);
          }

          if (data.status === "start") {
            setTotalCount(data.total);
          } else if (data.status === "progress") {
            setProcessedCount((prev) => prev + 1);

            // Reconstruct the row and append backend results
            processedRows.push({
              ...data.row_data,
              Generated_Username: data.success ? data.username : "FAILED",
              Generated_Password: data.success ? data.password : "FAILED",
              Upload_Status: data.success ? "Success" : "Error",
              Error_Details: data.success ? "" : data.error,
            });
          } else if (data.status === "complete") {
            setStatus("complete");
            generateAndDownloadExcel(processedRows);
          }
        }
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "A network error occurred during upload.");
    }
  };

  const generateAndDownloadExcel = (dataRows) => {
    // Convert JSON data back into an Excel workbook
    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Import Results");

    // Trigger download
    XLSX.writeFile(workbook, "Employee_Bulk_Creation_Results.xlsx");
  };

  // Calculate progress percentage
  const progressPercentage =
    totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

  return (
    <GovCard className="max-w-2xl w-full mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
        Bulk Upload & Create
      </h3>

      {/* Upload Zone */}
      <div className="mb-6">
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            file
              ? "border-primary-dark bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud
              className={`w-10 h-10 mb-3 ${file ? "text-primary-dark" : "text-gray-400"}`}
            />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV or XLSX (Max 10MB)</p>
            {file && (
              <p className="mt-3 text-sm font-bold text-primary-dark break-all px-4 text-center">
                Selected: {file.name}
              </p>
            )}
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".csv, .xlsx"
            className="hidden"
            onChange={handleFileChange}
            disabled={status === "processing"}
          />
        </label>
      </div>

      {/* Action Area */}
      {status === "idle" && (
        <GovButton
          onClick={processBulkUpload}
          disabled={!file}
          className="w-full gap-2"
        >
          <UploadCloud size={18} /> Start Processing
        </GovButton>
      )}

      {/* Real-time Loader / Progress */}
      {status === "processing" && (
        <div className="space-y-4 bg-gray-50 border border-gray-200 p-5 rounded-md">
          <div className="flex justify-between text-sm font-semibold text-gray-700">
            <span>Processing Employees...</span>
            <span>
              {processedCount} / {totalCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-dark h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-center text-gray-500 animate-pulse">
            Please do not close this window while generation is in progress.
          </p>
        </div>
      )}

      {/* Success State */}
      {status === "complete" && (
        <div className="flex flex-col items-center justify-center p-6 bg-green-50 border border-green-200 rounded-md text-center space-y-3">
          <CheckCircle size={40} className="text-green-500" />
          <h4 className="text-lg font-bold text-green-800">
            Processing Complete!
          </h4>
          <p className="text-sm text-green-700">
            Successfully parsed {totalCount} records.
          </p>
          <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-white rounded text-sm font-medium border border-green-300 shadow-sm text-gray-700">
            <FileSpreadsheet size={16} className="text-green-600" />
            Your generated credentials Excel file is downloading automatically.
          </div>
          <GovButton
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setFile(null);
              setStatus("idle");
            }}
          >
            Upload Another File
          </GovButton>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-md text-center space-y-3">
          <AlertCircle size={40} className="text-red-500" />
          <h4 className="text-lg font-bold text-red-800">Upload Failed</h4>
          <p className="text-sm text-red-700 max-w-sm">{errorMessage}</p>
          <GovButton
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setStatus("idle")}
          >
            Try Again
          </GovButton>
        </div>
      )}
    </GovCard>
  );
}
