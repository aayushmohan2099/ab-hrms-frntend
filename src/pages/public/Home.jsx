import { Link } from "react-router-dom";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import { Building } from "lucide-react";

export function Home() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-primary-dark rounded-full mb-6">
          <Building size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Human Resource Management System</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Welcome to the official HRMS portal. A centralized platform for managing personnel, attendance, and payroll operations efficiently and transparently.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <GovCard className="text-center p-8 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Employee Self Service</h2>
          <p className="text-gray-600 mb-6">Access your personal profile, view attendance records, and download monthly salary slips securely.</p>
          <Link to="/login">
            <GovButton>Access Portal</GovButton>
          </Link>
        </GovCard>
        
        <GovCard className="text-center p-8 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Administrative Control</h2>
          <p className="text-gray-600 mb-6">Comprehensive tools for managers and administrators to oversee departmental operations and reporting.</p>
          <Link to="/login">
            <GovButton variant="outline">Admin Login</GovButton>
          </Link>
        </GovCard>
      </div>
    </div>
  );
}
