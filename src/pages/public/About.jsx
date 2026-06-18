// src/pages/About.jsx
import { GovCard } from "../../components/ui/GovCard";
import { Users, Target, Shield, Clock } from "lucide-react";

export function About() {
  const values = [
    {
      icon: Users,
      title: "People First",
      description:
        "Our core focus is empowering employees with transparent and accessible human resource tools.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Built on robust government frameworks ensuring absolute data privacy and statutory compliance.",
    },
    {
      icon: Target,
      title: "Precision",
      description:
        "Automated, error-free calculation engines for attendance pro-ration and accurate payroll generation.",
    },
    {
      icon: Clock,
      title: "Efficiency",
      description:
        "Streamlining administrative workflows to reduce processing times from weeks to hours.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          About AB Enterprise HRMS
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          AB Enterprise HRMS is a next-generation administrative platform
          designed specifically for government and large-scale enterprise
          operations. We bridge the gap between complex statutory requirements
          and intuitive user experiences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <GovCard className="p-8 sm:p-10 border border-gray-200 shadow-sm bg-white h-full flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To deliver a seamless, transparent, and highly secure human resource
            ecosystem. We aim to eliminate administrative bottlenecks, ensuring
            that every employee—from mission managers to data entry
            operators—experiences fair, timely, and accurate processing of their
            attendance and wages.
          </p>
        </GovCard>
        <GovCard className="p-8 sm:p-10 border border-gray-200 shadow-sm bg-primary-dark text-white h-full flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">The System</h2>
          <p className="text-blue-100 leading-relaxed">
            Engineered with a robust backend architecture, this portal handles
            complex, dynamic payroll rules including pro-rated attendance,
            statutory EPF/ESIC/TDS deductions, and automated financial-year
            leave allowances with absolute mathematical precision.
          </p>
        </GovCard>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Core Principles
        </h2>
        <div className="w-20 h-1 bg-primary-light mx-auto rounded-full"></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <GovCard
              key={index}
              className="p-6 text-center hover:-translate-y-1 transition-transform duration-300 border-gray-200 shadow-sm bg-white"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-primary-light mx-auto flex items-center justify-center mb-4">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </GovCard>
          );
        })}
      </div>
    </div>
  );
}
