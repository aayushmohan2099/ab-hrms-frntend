// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute"; // Added PublicRoute import
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ManagerLayout } from "../layouts/ManagerLayout";
import { EmployeeLayout } from "../layouts/EmployeeLayout";

// Admin Pages
import { AdminDashboard } from "../pages/admin/Dashboard";
import { UsersList } from "../pages/admin/UsersList";
import { DepartmentsList } from "../pages/admin/DepartmentsList";
import { EmpList } from "../pages/admin/EmpList";
import { CreateEmp } from "../pages/admin/EmpComps/CreateEmp";
import { BulkCreateEmp } from "../pages/admin/EmpComps/BulkCreateEmp";
import { AttenList } from "../pages/admin/AttenList";
import { BulkUploadAtten } from "../pages/admin/AttenComps/BulkUploadAtten";
import { HolidayPattern } from "../pages/admin/AttenComps/HolidayPattern";
import { EmployeeCalendar } from "../pages/admin/AttenComps/EmployeeCalendar";
import { LeaveApplicationList } from "../pages/admin/LeaveApplicationList";
import { ApplicationDetail } from "../pages/admin/LAComps/ApplicationDetail";
import { AdminSalarySlips } from "../pages/admin/SalarySlip";

// Manager Pages
import { ManagerDashboard } from "../pages/manager/Dashboard";
import { EmpList as ManagerEmpList } from "../pages/manager/EmpList";
import { CreateEmp as ManagerCreateEmp } from "../pages/manager/EmpComps/CreateEmp";
import { BulkCreateEmp as ManagerBulkCreateEmp } from "../pages/manager/EmpComps/BulkCreateEmp";
import { LeaveApplicationList as ManagerLeaveApplicationList } from "../pages/manager/LeaveApplicationList";
import { ApplicationDetail as ManagerApplicationDetail } from "../pages/manager/LAComps/ApplicationDetail";
import { AttenList as ManagerAttenList } from "../pages/manager/AttenList";
import { BulkUploadAtten as ManagerBulkUploadAtten } from "../pages/manager/AttenComps/BulkUploadAtten";
import { HolidayPattern as ManagerHolidayPattern } from "../pages/manager/AttenComps/HolidayPattern";
import { EmployeeCalendar as ManagerEmployeeCalendar } from "../pages/manager/AttenComps/EmployeeCalendar";
import { PayrollList } from "../pages/manager/Payroll/PayrollList";
import { PayrollDetail } from "../pages/manager/Payroll/PayrollDetail";
import { ManagerSalarySlips } from "../pages/manager/SalarySlip";

// Employee Pages
import { EmployeeDashboard } from "../pages/employee/dashboard";
import { EmployeeProfile } from "../pages/employee/profile";
import { LeaveApplication } from "../pages/employee/LeaveApplication";
import { ApplyLeave } from "../pages/employee/LAComps/Apply";
import { SalarySlip } from "../pages/employee/salarySlip";
import { DownloadSlip } from "../pages/employee/salComps/downloadSlip";

// Error Pages
import { NotFound } from "../pages/errors/NotFound";
import { Unauthorized } from "../pages/errors/Unauthorized";

// Public Pages
import { Home } from "../pages/public/Home";
import { Login } from "../pages/public/Login";
import { About } from "../pages/public/About";
import { Support } from "../pages/public/Support";
import { Updates } from "../pages/public/Updates";

const Placeholder = ({ title }) => (
  <div className="p-4 bg-white rounded shadow">{title} Page Stub</div>
);

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes (Wrapped in PublicRoute to prevent logged-in users from accessing them) */}
      <Route element={<PublicRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/latest-updates" element={<Updates />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Administrator"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="departments" element={<DepartmentsList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="employees" element={<EmpList />} />
          <Route path="employees/create" element={<CreateEmp />} />
          <Route path="employees/bulk-register" element={<BulkCreateEmp />} />

          <Route path="attendance" element={<AttenList />} />
          <Route path="attendance/bulk-upload" element={<BulkUploadAtten />} />
          <Route
            path="attendance/holiday-pattern"
            element={<HolidayPattern />}
          />
          <Route path="attendance/calendar" element={<EmployeeCalendar />} />

          <Route path="attendance/LA/list" element={<LeaveApplicationList />} />
          <Route path="leaves/:id" element={<ApplicationDetail />} />

          <Route path="salary-slips" element={<AdminSalarySlips />} />
          <Route
            path="reports"
            element={<Placeholder title="Admin Reports" />}
          />
        </Route>
      </Route>

      {/* Manager Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboard />} />

          <Route
            path="departments"
            element={<Placeholder title="Manager Department Details" />}
          />
          <Route path="employees" element={<ManagerEmpList />} />
          <Route path="employees/create" element={<ManagerCreateEmp />} />
          <Route
            path="employees/bulk-register"
            element={<ManagerBulkCreateEmp />}
          />
          <Route
            path="leave-applications"
            element={<ManagerLeaveApplicationList />}
          />
          <Route path="leaves/:id" element={<ManagerApplicationDetail />} />

          <Route path="attendance" element={<ManagerAttenList />} />
          <Route
            path="attendance/bulk-upload"
            element={<ManagerBulkUploadAtten />}
          />
          <Route
            path="attendance/holiday-pattern"
            element={<ManagerHolidayPattern />}
          />
          <Route
            path="attendance/calendar"
            element={<ManagerEmployeeCalendar />}
          />

          <Route path="payroll" element={<PayrollList />} />
          <Route path="payroll/:runId" element={<PayrollDetail />} />
          <Route path="salary-slips" element={<ManagerSalarySlips />} />
        </Route>
      </Route>

      {/* Employee Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Employee"]} />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="LeaveApplication" element={<LeaveApplication />} />
          <Route path="LA/apply/new" element={<ApplyLeave />} />
          <Route path="salary-slips" element={<SalarySlip />} />
          <Route path="salary-slips/download" element={<DownloadSlip />} />
        </Route>
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
