// src/pages/admin/Dashboard.jsx
import { useAuth } from "../../contexts/AuthContext";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import { GovBadge } from "../../components/ui/GovBadge";
import {
  ShieldCheck,
  Settings,
  Users,
  Building,
  Database,
  Key,
  FileCheck,
  Server,
} from "lucide-react";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const { user } = useAuth();

  const adminModules = [
    {
      title: "Organization Master",
      icon: Building,
      description:
        "Define and manage the foundational structure of the enterprise. Configure active departments, create designations, and establish reporting hierarchies across the organization.",
      actionText: "Manage Structure",
      link: "/admin/departments",
    },
    {
      title: "Payroll & Compliance Engine",
      icon: Database,
      description:
        "Control the global financial parameters. Set departmental salary structures, configure statutory deduction rates (EPF, ESIC, TDS), and define financial year leave policies.",
      actionText: "Configure Payroll Rules",
      link: "/admin/departments",
    },
    {
      title: "Access & Identity Management",
      icon: Key,
      description:
        "Provision new personnel profiles, assign departmental managers, and oversee role-based access controls to ensure strict data privacy and operational security.",
      actionText: "Manage Users",
      link: "/admin/users",
    },
    {
      title: "Salary Audit & Logs",
      icon: FileCheck,
      description:
        "Monitor system-wide activity. Review configuration changes, verify compliance updates, and ensure the overall integrity of the HRMS infrastructure.",
      actionText: "View Audit Logs",
      link: "/admin/salary-slips",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-xl overflow-hidden shadow-sm bg-primary-dark">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-light opacity-20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 px-8 py-10 sm:px-12 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left text-white max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <ShieldCheck size={16} className="text-primary-light" />
              <span>Master Administrator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight leading-tight">
              Welcome to the Control Center,{" "}
              {user?.first_name || user?.username}
            </h1>
            <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
              As the System Administrator, you orchestrate the core framework of
              the HRMS. Your configurations dictate payroll mathematics,
              structural hierarchies, and security protocols across all
              departments.
            </p>
          </div>
          <div className="hidden md:flex flex-shrink-0 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
            <Settings
              size={80}
              className="text-white/80 animate-[spin_10s_linear_infinite]"
            />
          </div>
        </div>
      </div>

      {/* System Status Ribbon */}
      <GovCard className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-success bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 text-success flex items-center justify-center">
            <Server size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">System Health</h3>
            <p className="text-xs text-gray-500">
              All core microservices and database instances are fully
              operational.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
              Current Financial Year
            </p>
            <p className="text-sm font-bold text-gray-900">
              FY {new Date().getFullYear()}-
              {String(new Date().getFullYear() + 1).slice(-2)}
            </p>
          </div>
          <GovBadge variant="success" className="px-3 py-1 text-sm">
            Online
          </GovBadge>
        </div>
      </GovCard>

      {/* Core Responsibilities Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Settings className="text-primary-light" size={24} />
          Administrative Domains
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {adminModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <GovCard
                key={index}
                className="group p-8 flex flex-col h-full bg-white hover:border-primary-light/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Subtle side highlight on hover */}
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-light scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>

                <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary-dark flex items-center justify-center mb-6 group-hover:bg-primary-dark group-hover:text-white transition-colors duration-300">
                  <Icon size={24} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {module.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                  {module.description}
                </p>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <Link to={module.link} className="inline-block outline-none">
                    <GovButton
                      variant="outline"
                      className="w-full sm:w-auto text-primary-dark border-gray-300 hover:bg-primary-dark hover:text-white transition-colors"
                    >
                      {module.actionText}
                    </GovButton>
                  </Link>
                </div>
              </GovCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
