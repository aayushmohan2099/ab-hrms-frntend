// src/pages/Support.jsx
import { GovCard } from "../../components/ui/GovCard";
import { Mail, Phone, MapPin, FileText, LifeBuoy } from "lucide-react";
import { motion } from "framer-motion";
import headerImg from "../../assets/SlideShow/slide_3.jpeg";

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
      detail: "abenterpriselko@gmail.com",
      subDetail: "Average response time: 24 hrs",
    },
    {
      icon: MapPin,
      title: "Head Office",
      detail:
        "Kensvilla, 204 - 2nd Floor, Above Darshan Hotel, Ramsana Circle, Highway Road, Mehsana - 384002",
      subDetail: "",
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
      a: "All leave applications, approvals, eligibility, and entitlements shall be governed by the Human Resource (HR) Policy/Service Rules of the respective department or organization. Employees are advised to refer to the applicable HR Manual for detailed leave provisions and compliance requirements.",
    },
    {
      q: "Whom should I contact if my attendance is marked incorrectly?",
      a: "Please raise a query with your immediate Reporting Manager or your Department Head. Managers have the authority to correct attendance records prior to payroll generation.",
    },
  ];

  // Reusable animation variants
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  return (
    <div className="px-10 py-10 sm:py-16 relative z-10 bg-white min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative -mx-10 -mt-20 mb-20 overflow-hidden"
      >
        {/* Background Image */}
        <img
          src={headerImg}
          alt="Support Background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[320px] items-center justify-center px-6 py-24">
          <motion.div variants={fadeUpVariant} className="text-center mt-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full mb-6">
              <LifeBuoy size={32} />
            </div>
            <h1
              className="max-w-6xl text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              HRMS Help & Support
            </h1>
            <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
              We are here to assist you. Find answers to common questions or
              reach out to our dedicated IT and HR support teams.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Grid: Left (Contact) and Right (FAQs) */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Contact Information */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUpVariant}
              className="text-2xl font-bold text-gray-900 mb-6"
            >
              Contact Us
            </motion.h2>
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div key={index} variants={fadeUpVariant}>
                  <GovCard className="p-6 flex items-start gap-4 border-gray-200 shadow-sm bg-white hover:-translate-y-1 transition-transform duration-300">
                    <div className="p-3 bg-blue-50 rounded-lg text-primary-dark">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {method.title}
                      </h3>
                      <p className="text-primary-light font-medium mt-1">
                        {method.detail}
                      </p>
                      {method.subDetail && (
                        <p className="text-sm text-gray-500 mt-1">
                          {method.subDetail}
                        </p>
                      )}
                    </div>
                  </GovCard>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Column: FAQs */}
          <motion.div
            className="lg:col-span-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUpVariant}
              className="mb-6 border-b border-gray-200 pb-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FileText size={26} className="text-primary-light" />
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={fadeUpVariant}>
                  <GovCard className="p-6 border border-gray-200 shadow-sm bg-white hover:border-primary-light/30 transition-colors h-full flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                      {faq.a}
                    </p>
                  </GovCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
