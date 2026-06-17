// src/pages/admin/LAComps/ApplicationDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { attendanceService } from "../../../api/attendanceService";
import { GovCard } from "../../../components/ui/GovCard";
import { GovButton } from "../../../components/ui/GovButton";
import { GovBadge } from "../../../components/ui/GovBadge";
import { GovSeparator } from "../../../components/ui/GovSeparator";
import { GovModal } from "../../../components/ui/GovModal";
import { GovInput } from "../../../components/ui/GovInput";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getLeaveDetail(id);
      setApplication(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load application details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAction = async (actionType) => {
    if (actionType === "approve") {
      if (
        !window.confirm(
          "Are you sure you want to approve this leave? This will update the employee's daily attendance records.",
        )
      )
        return;
    }

    setActionLoading(true);
    try {
      // If backend supports passing a reason for rejection in the future, we could pass rejectReason here.
      // Currently, the backend only requires the action parameter.
      await attendanceService.actionLeaveApplication(id, actionType);

      if (actionType === "reject") setIsRejectModalOpen(false);

      // Refresh the data to show the new status
      fetchDetail();
    } catch (err) {
      alert(
        err.response?.data?.detail || `Failed to ${actionType} application.`,
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-12 text-center text-gray-500">Loading details...</div>
    );

  if (error || !application) {
    return (
      <div className="max-w-4xl mx-auto">
        <GovCard className="p-8 text-center text-danger font-medium">
          <p>{error || "Application not found."}</p>
          <GovButton
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/admin/attendance/LA/list")}
          >
            Back to List
          </GovButton>
        </GovCard>
      </div>
    );
  }

  const getLeaveTypeDisplay = (type) => {
    switch (type) {
      case "MATERNITY":
        return "Maternity Leave (ML)";
      case "CASUAL":
        return "Casual Leave (CL)";
      case "SICK":
        return "Sick Leave (SL)";
      default:
        return type;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "warning";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate("/admin/attendance/LA/list")}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Leave Application Review
            </h2>
            <p className="text-sm text-gray-500">
              Submitted on {new Date(application.created_at).toLocaleString()}
            </p>
          </div>
          <GovBadge
            variant={getStatusBadgeVariant(application.status)}
            className="px-4 py-1 text-sm"
          >
            {application.status}
          </GovBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Application Details */}
        <div className="md:col-span-2 space-y-6">
          <GovCard>
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
              Request Information
            </h3>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
              <div>
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Leave Type
                </span>
                <span className="text-gray-900 font-medium">
                  {getLeaveTypeDisplay(application.leave_type)}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Duration
                </span>
                <span className="text-gray-900 font-medium">
                  {application.start_date}{" "}
                  <span className="text-gray-400 mx-1">to</span>{" "}
                  {application.end_date}
                </span>
              </div>
              <div className="col-span-2">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Reason Provided
                </span>
                <p className="text-gray-800 bg-gray-50 p-3 rounded border border-gray-200 min-h-[80px]">
                  {application.reason || (
                    <span className="italic text-gray-400">
                      No reason provided.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {application.status === "PENDING" && (
              <>
                <GovSeparator className="mb-4" />
                <div className="flex justify-end gap-3">
                  <GovButton
                    variant="danger"
                    className="gap-2"
                    disabled={actionLoading}
                    onClick={() => setIsRejectModalOpen(true)}
                  >
                    <XCircle size={18} /> Reject Request
                  </GovButton>
                  <GovButton
                    variant="primary"
                    className="gap-2 bg-green-600 hover:bg-green-700 border-green-600 focus:ring-green-600"
                    disabled={actionLoading}
                    onClick={() => handleAction("approve")}
                  >
                    <CheckCircle size={18} /> Approve Leave
                  </GovButton>
                </div>
              </>
            )}
          </GovCard>
        </div>

        {/* Right Column: Employee Context */}
        <div className="space-y-6">
          <GovCard className="bg-blue-50/50 border-blue-100">
            <h3 className="text-sm font-bold text-primary-dark uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">
              Employee Context
            </h3>

            <div className="flex items-center gap-3 mb-6">
              {application.full_employee_profile?.profile_picture ? (
                <img
                  src={application.full_employee_profile.profile_picture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-gray-500 text-lg">
                  {application.employee_name.charAt(0)}
                </div>
              )}
              <div>
                <span className="block font-bold text-gray-900 leading-tight">
                  {application.employee_name}
                </span>
                <span className="text-xs font-mono text-gray-600">
                  {application.employee_code}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-200/50 pb-1">
                <span className="text-gray-500">Department</span>
                <span className="font-medium text-gray-800">
                  {application.department_name}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200/50 pb-1">
                <span className="text-gray-500">Designation</span>
                <span className="font-medium text-gray-800">
                  {application.designation_name}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200/50 pb-1">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-800">
                  {application.employee_type}
                </span>
              </div>
            </div>
          </GovCard>

          <GovCard>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              Month Attendance
            </h3>
            <div className="text-center py-2">
              <span className="block text-4xl font-black text-primary-dark tracking-tighter">
                {application.attendance_summary}
              </span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1 block">
                Present / Total Days
              </span>
              <span className="text-[10px] text-gray-400 block mt-2">
                Calculated for the month of the leave start date.
              </span>
            </div>
          </GovCard>

          <GovCard>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
              Approval Chain
            </h3>
            <div className="text-sm">
              <span className="text-gray-500 block mb-1">
                Assigned Approver:
              </span>
              <span className="font-medium text-gray-800 block">
                {application.approver_name}
              </span>
              <span className="text-xs text-gray-400">
                {application.approver_role}
              </span>
            </div>
          </GovCard>
        </div>
      </div>

      {/* Rejection Modal */}
      <GovModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Leave Application"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please provide a reason for rejecting this leave application. This
            is highly recommended for HR compliance.
          </p>
          <GovInput
            id="reject_reason"
            label="Rejection Reason (Optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="E.g., High project workload, overlapping leaves..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <GovButton
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </GovButton>
            <GovButton
              variant="danger"
              onClick={() => handleAction("reject")}
              disabled={actionLoading}
            >
              {actionLoading ? "Rejecting..." : "Confirm Rejection"}
            </GovButton>
          </div>
        </div>
      </GovModal>
    </div>
  );
}
