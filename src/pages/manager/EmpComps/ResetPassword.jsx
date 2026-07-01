// src/pages/admin/EmpComps/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userManagementService } from "../../../api/userMgmnt";
import { GovCard } from "../../../components/ui/GovCard";
import { GovButton } from "../../../components/ui/GovButton";
import {
  KeyRound,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export function ResetPassword() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleReset = async () => {
    if (!id) {
      setError("Invalid User ID provided.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const data = await userManagementService.resetPassword(id);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to reset password. Please verify the user is active and exists.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.new_password) {
      try {
        await navigator.clipboard.writeText(result.new_password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-6">
        <GovButton
          variant="outline"
          size="sm"
          onClick={() => window.open("/admin/employees", "_self")}
          className="gap-2 text-gray-600 border-gray-300"
        >
          <ArrowLeft size={16} /> Back
        </GovButton>
      </div>

      <GovCard className="p-8 sm:p-12 text-center border-t-4 border-t-danger shadow-lg bg-white">
        <div className="w-20 h-20 bg-red-50 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
          <KeyRound size={40} />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
          Reset User Password
        </h1>

        {!result && !loading && !error && (
          <>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              You are about to generate a new, secure password for this user.
              The existing password will be permanently invalidated.
            </p>
            <GovButton
              variant="danger"
              size="lg"
              onClick={handleReset}
              className="px-8 shadow-sm font-bold tracking-wide"
            >
              Generate New Password
            </GovButton>
          </>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2
              size={48}
              className="text-primary-light animate-spin mb-4"
            />
            <p className="text-gray-500 font-medium">
              Generating secure credentials...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center gap-3">
            <AlertCircle size={32} className="text-danger" />
            <p className="text-danger font-medium">{error}</p>
            <GovButton
              variant="outline"
              size="sm"
              onClick={() => setError(null)}
              className="mt-2"
            >
              Try Again
            </GovButton>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-bold mb-6 border border-green-200">
              <CheckCircle2 size={16} />
              <span>{result.detail || "Password Successfully Reset"}</span>
            </div>

            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-2">
              Username: <span className="text-gray-900">{result.username}</span>
            </p>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 mb-6 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary-light"></div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">
                New Temporary Password
              </p>
              <div className="text-4xl sm:text-5xl font-mono font-black text-gray-900 tracking-tight break-all selection:bg-primary-light selection:text-white">
                {result.new_password}
              </div>
            </div>

            <GovButton
              variant={copied ? "success" : "primary"}
              size="lg"
              onClick={handleCopy}
              className="gap-2 w-full sm:w-auto px-10 shadow-md font-bold transition-all duration-300"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={20} /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy size={20} /> Copy Password
                </>
              )}
            </GovButton>

            <p className="mt-6 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg text-left flex items-start gap-3">
              <AlertCircle size={20} className="text-primary-light shrink-0" />
              <span>
                <strong>Important:</strong> Please copy this password
                immediately and share it securely with the employee. For
                security reasons, this password cannot be retrieved once you
                leave this page.
              </span>
            </p>
          </div>
        )}
      </GovCard>
    </div>
  );
}
