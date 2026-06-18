// src/pages/Support.jsx
import { GovCard } from "../../components/ui/GovCard";
import { Mail, Phone, MapPin, FileText, LifeBuoy } from "lucide-react";

export function Support() {
  const contactMethods = [
    {
      icon: Phone,
      title: "IT Helpdesk",
      detail: "1800-XXX-XXXX",
      subDetail: "Mon-Sat, 9:00 AM - 6:00 PM",
    },
    {
      icon: Mail,
      title: "Email Support",
      detail: "hrms.support@abenterprise.gov",
      subDetail: "Average response time: 24 hrs",
    },
    {
      icon: MapPin,
      title: "Head Office",
      detail: "AB Enterprise Administrative Block",
      subDetail: "Sector 4, State Capital",
    },
  ];

  const faqs = [
    {
      q: "How do I reset my portal password?",
      a: "Please contact your department manager to reset your account to the default password.",
    },
    {
      q: "My salary slip is not generating for the previous month.",
      a: "Salary slips are only available after your Department Manager has 'Approved & Locked' the payroll run for that specific month.",
    },
    {
      q: "How are my casual and sick leaves calculated?",
      a: "Employees are allotted a total of 15 days (CL + SL) per financial year (April - March). Any leaves taken beyond this quota will result in a pro-rated deduction from your monthly honorarium.",
    },
    {
      q: "Whom should I contact if my attendance is marked incorrectly?",
      a: "Please raise a query with your immediate Reporting Manager or your Department Head. Managers have the authority to correct attendance records prior to payroll generation.",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-primary-light rounded-full mb-6">
          <LifeBuoy size={32} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          HRMS Help & Support
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We are here to assist you. Find answers to common questions or reach
          out to our dedicated IT and HR support teams.
        </p>
      </div>

      {/* Main Grid: Left (Contact) and Right (FAQs) */}
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <GovCard
                key={index}
                className="p-6 flex items-start gap-4 border-gray-200 shadow-sm bg-white"
              >
                <div className="p-3 bg-gray-50 rounded-lg text-primary-dark">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{method.title}</h3>
                  <p className="text-primary-light font-medium mt-1">
                    {method.detail}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {method.subDetail}
                  </p>
                </div>
              </GovCard>
            );
          })}
        </div>

        {/* Right Column: FAQs */}
        <div className="lg:col-span-2">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText size={26} className="text-primary-light" />
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <GovCard
                key={index}
                className="p-6 border border-gray-200 shadow-sm bg-white hover:border-primary-light/30 transition-colors h-full flex flex-col"
              >
                <h3 className="font-bold text-gray-900 mb-3 text-base">
                  {faq.q}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  {faq.a}
                </p>
              </GovCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
