import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, LayoutDashboard, Building2, Users, FileText, Calendar } from "lucide-react";

export function ManagerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-secondary text-base flex flex-col shadow-lg">
        <div className="p-5 border-b border-blue-700">
          <h2 className="text-xl font-bold">Manager Portal</h2>
          <p className="text-xs text-blue-200 mt-1">Department View</p>
        </div>
        <nav className="flex-grow py-4">
          <ul className="space-y-1 px-3">
            <li><Link to="/manager/dashboard" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><LayoutDashboard size={18}/> Dashboard</Link></li>
            <li><Link to="/manager/departments" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><Building2 size={18}/> My Department</Link></li>
            <li><Link to="/manager/users" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><Users size={18}/> Users</Link></li>
            <li><Link to="/manager/employees" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><Users size={18}/> Employees</Link></li>
            <li><Link to="/manager/attendance" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><Calendar size={18}/> Attendance</Link></li>
            <li><Link to="/manager/salary-slips" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-primary-dark transition-colors"><FileText size={18}/> Salary Slips</Link></li>
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-base border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <h1 className="text-xl font-semibold text-gray-800">Welcome, {user?.username}</h1>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Manager</div>
        </header>
        <main className="flex-grow p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
