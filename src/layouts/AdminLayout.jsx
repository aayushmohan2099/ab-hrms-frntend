import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, LayoutDashboard, Building2, Users, FileText, Calendar } from "lucide-react";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-accent-navy text-base flex flex-col shadow-lg">
        <div className="p-5 border-b border-primary-dark">
          <h2 className="text-xl font-bold">Admin Portal</h2>
          <p className="text-xs text-primary-light mt-1">HRMS Management</p>
        </div>
        <nav className="flex-grow py-4">
          <ul className="space-y-1 px-3">
            <li><Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><LayoutDashboard size={18}/> Dashboard</Link></li>
            <li><Link to="/admin/departments" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><Building2 size={18}/> Departments</Link></li>
            <li><Link to="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><Users size={18}/> Users</Link></li>
            <li><Link to="/admin/employees" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><Users size={18}/> Employees</Link></li>
            <li><Link to="/admin/attendance" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><Calendar size={18}/> Attendance</Link></li>
            <li><Link to="/admin/salary-slips" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><FileText size={18}/> Salary Slips</Link></li>
          </ul>
        </nav>
        <div className="p-4 border-t border-primary-dark">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-base border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <h1 className="text-xl font-semibold text-gray-800">Welcome, {user?.username}</h1>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Administrator</div>
        </header>
        <main className="flex-grow p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
