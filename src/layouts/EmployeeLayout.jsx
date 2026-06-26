// src/layouts/EmployeeLayout.jsx
import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, LayoutDashboard, User, Users, FileText, Menu, X } from "lucide-react";

export function EmployeeLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { path: "/employee/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      path: "/employee/LeaveApplication",
      icon: FileText,
      label: "Apply for Leave",
    },
    { path: "/employee/profile", icon: User, label: "Profile" },
    { path: "/employee/salary-slips", icon: FileText, label: "Salary Slips" },
    { path: "/employee/emp-form-16", icon: Users, label: "Download Form-16" },
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
        className={`fixed md:relative inset-y-0 left-0 z-30 w-64 bg-primary-light text-base flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-blue-400 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Employee Portal</h2>
            <p className="text-xs text-blue-100 mt-1">Self Service</p>
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
                        : "hover:bg-secondary text-blue-50"
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

        <div className="p-4 border-t border-blue-400">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 font-medium text-sm text-blue-100 hover:text-white hover:bg-secondary p-2 rounded w-full transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 w-full md:w-auto h-screen">
        {/* Header */}
        <header className="bg-base border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
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
            Employee Profile
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
