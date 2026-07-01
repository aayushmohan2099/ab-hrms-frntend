// src/layouts/EmployeeLayout.jsx
import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GovModal } from "../components/ui/GovModal";
import { GovInput } from "../components/ui/GovInput";
import { GovButton } from "../components/ui/GovButton";
import { userManagementService } from "../api/userMgmnt";
import {
  LogOut,
  LayoutDashboard,
  User,
  Users,
  FileText,
  Menu,
  X,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function EmployeeLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await userManagementService.changePassword(user.id, {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setPasswordSuccess("Password updated successfully.");

      // Auto close and logout after 2 seconds
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        handleLogout();
      }, 2000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.detail ||
          "Failed to change password. Please check your old password.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const resetModalState = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
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
        <div className="p-5 border-b border-blue-400 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Employee Portal</h2>
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

        {/* Sticky Action Buttons */}
        <div className="p-4 border-t border-blue-400 mt-auto shrink-0 flex items-center justify-between gap-2 bg-primary-light">
          <button
            onClick={() => {
              resetModalState();
              setIsPasswordModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 font-medium text-sm text-blue-100 hover:text-white hover:bg-secondary p-2 rounded transition-colors"
            title="Change Password"
          >
            <KeyRound size={18} />{" "}
            <span className="hidden xl:inline">Password</span>
          </button>

          <div className="w-px h-6 bg-blue-400"></div>

          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 font-medium text-sm text-red-300 hover:text-white hover:bg-danger p-2 rounded transition-colors"
          >
            <LogOut size={18} />{" "}
            <span className="hidden xl:inline">Logout</span>
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

      {/* Change Password Modal */}
      <GovModal
        isOpen={isPasswordModalOpen}
        onClose={() => !isChangingPassword && setIsPasswordModalOpen(false)}
        title="Change Your Password"
        className="max-w-md"
      >
        <form onSubmit={handleChangePasswordSubmit} className="space-y-6 pb-2">
          {passwordError && (
            <div className="p-3 bg-red-50 text-danger text-sm rounded border border-red-200 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200 flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>{passwordSuccess} Redirecting to login...</span>
            </div>
          )}

          <div className="space-y-4">
            <GovInput
              id="oldPassword"
              type="password"
              label="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              showPasswordToggle
              required
            />

            <GovInput
              id="newPassword"
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              showPasswordToggle
              required
            />

            {newPassword && (
              <div className="text-sm p-3 bg-gray-50 border border-gray-200 rounded-md break-all">
                <span className="text-gray-500 font-semibold">
                  Your new password will be:{" "}
                </span>
                <span className="font-mono text-primary-dark font-bold">
                  {newPassword}
                </span>
              </div>
            )}

            <GovInput
              id="confirmPassword"
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPasswordToggle
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <GovButton
              type="button"
              variant="outline"
              onClick={() => setIsPasswordModalOpen(false)}
              disabled={isChangingPassword || passwordSuccess}
            >
              Cancel
            </GovButton>
            <GovButton
              type="submit"
              variant="primary"
              disabled={isChangingPassword || passwordSuccess}
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </GovButton>
          </div>
        </form>
      </GovModal>
    </div>
  );
}
