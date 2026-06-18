// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import { Users, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export function Home() {
  return (
    <div className="w-full flex-grow flex flex-col relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <style>
        {`
          .bg-grid-pattern {
            background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 24px 24px;
          }
        `}
      </style>
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-primary-light/5 blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none z-0"></div>

      {/* Main Content Container */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-secondary text-sm font-semibold mb-8 shadow-sm">
            <CheckCircle2 size={16} className="text-primary-light" />
            <span>Official Personnel Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.15]">
            Enterprise{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary-light">
              Resource Management
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A secure, centralized platform for managing personnel profiles,
            attendance workflows, and precise payroll operations with absolute
            transparency.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-5xl px-4">
          {/* Employee Card */}
          <GovCard className="group relative bg-white p-8 sm:p-10 border border-gray-200 hover:border-primary-light/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden text-left flex flex-col h-full">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-light scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>

            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-primary-light group-hover:text-white transition-colors duration-300 text-primary-light shadow-sm">
              <Users size={28} strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              Employee Self Service
            </h2>
            <p className="text-gray-600 mb-8 flex-grow leading-relaxed text-base">
              Access your personal employment profile, review daily attendance
              records, submit leave requests, and securely download your monthly
              wage slips.
            </p>

            <div className="pt-2 mt-auto border-t border-gray-100">
              <Link to="/login" className="block outline-none">
                <GovButton className="w-full sm:w-auto gap-2 group-hover:bg-accent-navy transition-colors text-base font-semibold shadow-sm">
                  Access Portal{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </GovButton>
              </Link>
            </div>
          </GovCard>

          {/* Admin / Manager Card */}
          <GovCard className="group relative bg-white p-8 sm:p-10 border border-gray-200 hover:border-primary-dark/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden text-left flex flex-col h-full">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-dark scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>

            <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100 group-hover:bg-primary-dark group-hover:text-white transition-colors duration-300 text-primary-dark shadow-sm">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              Administrative Control
            </h2>
            <p className="text-gray-600 mb-8 flex-grow leading-relaxed text-base">
              Comprehensive tools designed for department managers and system
              administrators to oversee personnel operations, manage approvals,
              and execute payroll runs.
            </p>

            <div className="pt-2 mt-auto border-t border-gray-100">
              <Link to="/login" className="block outline-none">
                <GovButton
                  variant="outline"
                  className="w-full sm:w-auto gap-2 border-gray-300 text-gray-700 hover:border-primary-dark hover:text-primary-dark hover:bg-indigo-50 transition-colors text-base font-semibold"
                >
                  Authorized Login{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </GovButton>
              </Link>
            </div>
          </GovCard>
        </div>
      </div>
    </div>
  );
}
