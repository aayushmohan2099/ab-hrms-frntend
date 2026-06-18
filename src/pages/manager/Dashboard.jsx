// src/pages/manager/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { attendanceService } from "../../api/attendanceService";
import { GovCard } from "../../components/ui/GovCard";
import { GovStatCard } from "../../components/ui/GovStatCard";
import { GovProgressBar } from "../../components/ui/GovProgressBar";
import { GovBarChart } from "../../components/charts/GovBarChart";
import { GovPieChart } from "../../components/charts/GovPieChart";
import { Users, UserCheck, UserX, AlertCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await attendanceService.getManagerDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch manager dashboard stats:", err);
        setError("Unable to load dashboard statistics. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-gray-500 font-medium">
          Loading Dashboard Data...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center text-danger font-medium bg-red-50 rounded border border-red-200">
        {error || "No data available."}
      </div>
    );
  }

  // Format data for Pie Chart (Today's Snapshot)
  const pieData = [
    { name: "Present", value: stats.today_snapshot.present },
    { name: "Absent", value: stats.today_snapshot.absent },
    { name: "On Leave", value: stats.today_snapshot.on_leave },
    { name: "Unmarked", value: stats.today_snapshot.unmarked },
  ].filter((item) => item.value > 0); // Only show segments > 0

  // Format data for Bar Chart (Designation Attendance)
  const barData = stats.designation_attendance.map((item) => ({
    name:
      item.designation.length > 15
        ? item.designation.substring(0, 15) + "..."
        : item.designation,
    value: item.attendance_percentage,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Department Overview
          </h2>
          <p className="text-sm font-medium text-primary-dark mt-1">
            {stats.department_info.name} ({stats.department_info.code})
          </p>
        </div>
        <div className="text-right text-sm text-gray-500 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-100">
          <span className="block font-semibold text-gray-700">
            Data valid as of:
          </span>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Action Items Alert */}
      {stats.action_items.pending_leave_requests > 0 && (
        <div
          onClick={() => navigate("/manager/leave-applications/")}
          className="bg-orange-50 border border-orange-200 p-4 rounded-md flex items-center justify-between cursor-pointer hover:bg-orange-100 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-orange-600" size={24} />
            <div>
              <h4 className="font-bold text-orange-800">Action Required</h4>
              <p className="text-sm text-orange-700">
                You have {stats.action_items.pending_leave_requests} pending
                leave applications requiring approval.
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold text-orange-800 underline">
            Review Now &rarr;
          </span>
        </div>
      )}

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GovStatCard
          title="Total Employees"
          value={stats.department_info.total_employees}
          icon={Users}
          variant="primary"
        />
        <GovStatCard
          title="Present Today"
          value={stats.today_snapshot.present}
          icon={UserCheck}
          variant="success"
        />
        <GovStatCard
          title="Absent Today"
          value={stats.today_snapshot.absent}
          icon={UserX}
          variant="danger"
        />
        <GovStatCard
          title="Pending Leaves"
          value={stats.action_items.pending_leave_requests}
          icon={FileText}
          variant="warning"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Today's Snapshot (Pie) */}
        <div className="lg:col-span-1 space-y-6">
          <GovCard className="h-full flex flex-col">
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
              Today's Attendance Status
            </h3>
            <div className="flex-1 flex flex-col justify-center">
              {pieData.length > 0 ? (
                <GovPieChart data={pieData} height={280} />
              ) : (
                <div className="text-center text-gray-500 py-12">
                  No attendance data marked for today yet.
                </div>
              )}
            </div>
          </GovCard>
        </div>

        {/* Right Col: Monthly Overview & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <GovCard>
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
              <h3 className="text-base font-bold text-gray-800">
                Monthly Performance (Avg)
              </h3>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                Month: {stats.monthly_overview.month}/
                {stats.monthly_overview.year}
              </span>
            </div>

            <div className="space-y-8 py-2">
              <div>
                <GovProgressBar
                  value={stats.monthly_overview.average_attendance_percentage}
                  label="Average Department Attendance"
                  variant={
                    stats.monthly_overview.average_attendance_percentage < 75
                      ? "danger"
                      : stats.monthly_overview.average_attendance_percentage <
                          90
                        ? "warning"
                        : "success"
                  }
                  size="lg"
                />
                <p className="text-xs text-gray-500 mt-2 text-right">
                  Target KPI: 90%
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                <div className="text-center">
                  <span className="block text-2xl font-black text-green-600">
                    {stats.monthly_overview.total_present_days}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Present Days
                  </span>
                </div>
                <div className="text-center border-x border-gray-100">
                  <span className="block text-2xl font-black text-red-500">
                    {stats.monthly_overview.total_absent_days}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Absent Days
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-black text-orange-500">
                    {stats.monthly_overview.total_leave_days}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Leave Days
                  </span>
                </div>
              </div>
            </div>
          </GovCard>

          <GovCard>
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
              Attendance by Designation (%)
            </h3>
            {barData.length > 0 ? (
              <GovBarChart data={barData} valueSuffix="%" height={260} />
            ) : (
              <div className="text-center text-gray-500 py-12">
                No data available to display.
              </div>
            )}
          </GovCard>
        </div>
      </div>
    </div>
  );
}
