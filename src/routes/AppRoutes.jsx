import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ManagerLayout } from "../layouts/ManagerLayout";
import { EmployeeLayout } from "../layouts/EmployeeLayout";

// Admin Pages
import { UsersList } from "../pages/admin/UsersList";
import { DepartmentsList } from "../pages/admin/DepartmentsList";
import { EmpList } from "../pages/admin/EmpList";
import { CreateEmp } from "../pages/admin/EmpComps/CreateEmp";
import { BulkCreateEmp } from "../pages/admin/EmpComps/BulkCreateEmp";
import { AttenList } from "../pages/admin/AttenList";
import { BulkUploadAtten } from "../pages/admin/AttenComps/BulkUploadAtten";
import { EmployeeCalendar } from "../pages/admin/AttenComps/EmployeeCalendar";
import { LeaveApplicationList } from "../pages/admin/LeaveApplicationList";
import { ApplicationDetail } from "../pages/admin/LAComps/ApplicationDetail";

// Employee Pages
import { EmployeeDashboard } from "../pages/employee/dashboard";
import { EmployeeProfile } from "../pages/employee/profile";
import { LeaveApplication } from "../pages/employee/LeaveApplication";
import { ApplyLeave } from "../pages/employee/LAComps/Apply";
import { SalarySlip } from "../pages/employee/salarySlip";

// Error Pages
import { NotFound } from "../pages/errors/NotFound";
import { Unauthorized } from "../pages/errors/Unauthorized";

// Public Pages
import { Home } from "../pages/public/Home";
import { Login } from "../pages/public/Login";

const Placeholder = ({ title }) => (
  <div className="p-4 bg-white rounded shadow">{title} Page Stub</div>
);

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Placeholder title="About" />} />
        <Route path="/support" element={<Placeholder title="Support" />} />
      </Route>
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Administrator"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="dashboard"
            element={<Placeholder title="Admin Dashboard" />}
          />
          <Route path="departments" element={<DepartmentsList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="employees" element={<EmpList />} />
          <Route path="employees/create" element={<CreateEmp />} />
          <Route path="employees/bulk-register" element={<BulkCreateEmp />} />

          <Route path="attendance" element={<AttenList />} />
          <Route path="attendance/bulk-upload" element={<BulkUploadAtten />} />
          <Route path="attendance/calendar" element={<EmployeeCalendar />} />

          <Route path="attendance/LA/list" element={<LeaveApplicationList />} />
          <Route path="leaves/:id" element={<ApplicationDetail />} />

          <Route
            path="salary-slips"
            element={<Placeholder title="Admin Salary Slips" />}
          />
          <Route
            path="reports"
            element={<Placeholder title="Admin Reports" />}
          />
        </Route>
      </Route>

      {/* Manager Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route
            path="dashboard"
            element={<Placeholder title="Manager Dashboard" />}
          />
          <Route
            path="departments"
            element={<Placeholder title="Manager Department Details" />}
          />
          <Route path="users" element={<Placeholder title="Manager Users" />} />
          <Route
            path="employees"
            element={<Placeholder title="Manager Employees" />}
          />
          <Route
            path="attendance"
            element={<Placeholder title="Manager Attendance" />}
          />
          <Route
            path="salary-slips"
            element={<Placeholder title="Manager Salary Slips" />}
          />
          <Route
            path="reports"
            element={<Placeholder title="Manager Reports" />}
          />
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
        </Route>
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
