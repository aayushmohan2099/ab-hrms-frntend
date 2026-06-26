// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LogOut,
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Calendar,
  Menu,
  X,
} from "lucide-react";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/news-list", icon: FileText, label: "Latest News Section" },
    { path: "/admin/departments", icon: Building2, label: "Departments" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/employees", icon: Users, label: "Employees" },
    { path: "/admin/form-16", icon: Users, label: "TDS Deduction Forms" },
    { path: "/admin/attendance", icon: Calendar, label: "Attendance" },
    {
      path: "/admin/attendance/LA/list",
      icon: Calendar,
      label: "Leave Application List",
    },
    { path: "/admin/salary-slips", icon: FileText, label: "Salary Slips" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 relative overflow-hidden">
      {/* Mobile Overlay Background */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-accent-navy text-base flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-primary-dark flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Admin Portal</h2>
            <p className="text-xs text-primary-light mt-1">HRMS Management</p>
          </div>
          <button
            className="md:hidden text-white hover:text-gray-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                      isActive
                        ? "bg-primary-dark text-white shadow-inner"
                        : "text-gray-300 hover:bg-primary-dark hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sticky Logout Button */}
        <div className="p-4 border-t border-primary-dark mt-auto shrink-0 bg-accent-navy">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 font-medium text-sm text-gray-300 hover:text-white hover:bg-primary-dark p-2 rounded w-full transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 w-full md:w-auto h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="p-1 -ml-1 text-gray-600 hover:text-primary-dark md:hidden rounded focus:outline-none focus:ring-2 focus:ring-primary-light"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-none">
              Welcome, {user?.first_name || user?.username}
            </h1>
          </div>
          <div className="text-xs sm:text-sm font-medium text-primary-dark bg-blue-50 border border-blue-100 px-3 py-1 rounded-full whitespace-nowrap">
            Administrator
          </div>
        </header>

        {/* Scrollable Main View */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
