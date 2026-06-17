// src/pages/employee/salComps/downloadSlip.jsx
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { salaryService } from "../../../api/salaryService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovButton } from "../../../components/ui/GovButton";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function DownloadSlip() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [status, setStatus] = useState("downloading"); // 'downloading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  // Use a ref to prevent strict-mode double downloading
  const hasDownloaded = useRef(false);

  // Destructure params safely sent from the previous page's navigate state
  const { month, year, employeeCode } = location.state || {};
  const codeToUse = employeeCode || user?.employee_code || user?.username;

  useEffect(() => {
    // If accessed directly without state, bounce them back
    if (!month || !year || !codeToUse) {
      navigate("/employee/salary-slips", { replace: true });
      return;
    }

    const triggerDownload = async () => {
      if (hasDownloaded.current) return;
      hasDownloaded.current = true;

      try {
        await salaryService.downloadSalarySlip(codeToUse, year, month);
        setStatus("success");
      } catch (err) {
        console.error("Download failed:", err);
        setStatus("error");
        setErrorMessage(
          "Unable to download the PDF. Please ensure the slip exists or try again.",
        );
      }
    };

    triggerDownload();
  }, [month, year, codeToUse, navigate]);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <GovCard className="text-center p-8">
        {status === "downloading" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-primary-dark rounded-full animate-spin"></div>
            <h3 className="text-lg font-semibold text-gray-800">
              Preparing Your Download...
            </h3>
            <p className="text-sm text-gray-500">
              Please wait while we securely generate your PDF.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle size={48} className="text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Download Complete
            </h3>
            <p className="text-sm text-gray-500">
              Your salary slip for {month}/{year} has been downloaded
              successfully.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle size={48} className="text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Download Failed
            </h3>
            <p className="text-sm text-danger">{errorMessage}</p>
          </div>
        )}

        <div className="mt-8">
          <GovButton
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/employee/salary-slips")}
          >
            <ArrowLeft size={16} /> Return to Salary Slips
          </GovButton>
        </div>
      </GovCard>
    </div>
  );
}
