// src/pages/About.jsx
import { GovCard } from "../../components/ui/GovCard";
import {
  Users,
  Target,
  Shield,
  Clock,
  CalendarCheck,
  FileSpreadsheet,
  Banknote,
  FileText,
  UploadCloud,
  ArrowRight,
  Database,
} from "lucide-react";
import { motion } from "framer-motion";
import headerImg from "../../assets/SlideShow/slide_2.jpeg";

export function About() {
  const values = [
    {
      icon: Users,
      title: "People First",
      description:
        "Empowering employees with transparent, accessible, and self-service human resource tools.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Built on robust frameworks ensuring absolute data privacy and statutory compliance (EPF, ESIC, TDS).",
    },
    {
      icon: Target,
      title: "Precision Engine",
      description:
        "Automated, error-free calculation engines for attendance pro-ration and accurate payroll generation.",
    },
    {
      icon: Clock,
      title: "Operational Efficiency",
      description:
        "Streamlining administrative workflows to reduce processing times from weeks to mere hours.",
    },
  ];

  const features = [
    {
      icon: CalendarCheck,
      title: "Automated Attendance & Leave",
      description:
        "The system intelligently manages daily attendance, automatically mapping weekends and declared holidays. The integrated Leave Management System supports multiple leave types (Casual, Sick, Maternity) with real-time balance tracking and hierarchical manager approvals.",
    },
    {
      icon: Banknote,
      title: "Dynamic Payroll Processing",
      description:
        "A highly precise payroll engine that automatically calculates pro-rated gross pay based on effective present days. It accurately computes statutory deductions like EPF (12%), ESIC (0.75%), and TDS (10%) to generate the final net payable amount.",
    },
    {
      icon: FileText,
      title: "One-Click Salary Slips",
      description:
        "Instantly generates immutable PDF salary slips at the end of every billing cycle. Each slip captures a historical snapshot of the employee's designation, base pay, and department, ensuring records remain accurate even if master data changes later.",
    },
    {
      icon: UploadCloud,
      title: "Bulk Operations Hub",
      description:
        "Designed for enterprise scale, the platform supports heavy data ingress. Administrators can bulk-upload employee registrations, monthly attendance records, and updates via standardized CSV and Excel templates with real-time error validation.",
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

  const scaleUpVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, type: "spring", bounce: 0.4 },
    },
  };

  const arrowVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
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
          alt="About Background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[320px] items-center justify-center px-6 py-24">
          <motion.div variants={fadeUpVariant} className="text-center mt-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full mb-6">
              <Users size={32} />
            </div>
            <h1
              className="max-w-6xl text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Human Resource Management System
            </h1>
            <p className="mt-4 text-lg text-gray-200 max-w-4xl mx-auto font-medium leading-relaxed">
              A next-generation enterprise resource planning platform engineered
              to bridge the gap between complex statutory payroll requirements
              and intuitive, frictionless user experiences.
            </p>
          </motion.div>
        </div>
      </motion.section>
      {/* CSS-Based Architecture Flowchart */}
      <div className="mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-center text-gray-900 mb-12 uppercase tracking-widest"
        >
          System Architecture Workflow
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-center w-full gap-4 md:gap-0 relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Step 1 */}
          <motion.div
            variants={scaleUpVariant}
            className="flex flex-col items-center w-40 z-10"
          >
            <div className="w-20 h-20 bg-white border-4 border-primary-light rounded-full flex items-center justify-center shadow-lg text-primary-dark mb-4 transition-transform hover:scale-110 duration-300">
              <Database size={32} />
            </div>
            <h4 className="font-bold text-gray-800 text-center text-sm">
              Master Data
            </h4>
            <p className="text-[15px] text-gray-500 text-center mt-1">
              Employee Profiles & Rules
            </p>
          </motion.div>

          {/* Connecting Line (Hidden on Mobile) */}
          <motion.div
            variants={arrowVariant}
            className="hidden md:flex flex-1 h-1 bg-gray-300 relative mx-2"
          >
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-gray-400">
              <ArrowRight size={20} />
            </div>
          </motion.div>

          {/* Mobile Arrow */}
          <motion.div
            variants={fadeUpVariant}
            className="md:hidden text-gray-300 my-2"
          >
            <ArrowRight size={24} className="rotate-90" />
          </motion.div>

          {/* Step 2 */}
          <motion.div
            variants={scaleUpVariant}
            className="flex flex-col items-center w-40 z-10"
          >
            <div className="w-20 h-20 bg-white border-4 border-secondary rounded-full flex items-center justify-center shadow-lg text-secondary mb-4 transition-transform hover:scale-110 duration-300">
              <CalendarCheck size={32} />
            </div>
            <h4 className="font-bold text-gray-800 text-center text-sm">
              Time & Leave
            </h4>
            <p className="text-[15px] text-gray-500 text-center mt-1">
              Attendance Pro-ration
            </p>
          </motion.div>

          {/* Connecting Line (Hidden on Mobile) */}
          <motion.div
            variants={arrowVariant}
            className="hidden md:flex flex-1 h-1 bg-gray-300 relative mx-2"
          >
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-gray-400">
              <ArrowRight size={20} />
            </div>
          </motion.div>

          {/* Mobile Arrow */}
          <motion.div
            variants={fadeUpVariant}
            className="md:hidden text-gray-300 my-2"
          >
            <ArrowRight size={24} className="rotate-90" />
          </motion.div>

          {/* Step 3 */}
          <motion.div
            variants={scaleUpVariant}
            className="flex flex-col items-center w-40 z-10"
          >
            <div className="w-20 h-20 bg-white border-4 border-warning rounded-full flex items-center justify-center shadow-lg text-warning mb-4 transition-transform hover:scale-110 duration-300">
              <Banknote size={32} />
            </div>
            <h4 className="font-bold text-gray-800 text-center text-sm">
              Payroll Engine
            </h4>
            <p className="text-[15px] text-gray-500 text-center mt-1">
              Gross & Deductions
            </p>
          </motion.div>

          {/* Connecting Line (Hidden on Mobile) */}
          <motion.div
            variants={arrowVariant}
            className="hidden md:flex flex-1 h-1 bg-gray-300 relative mx-2"
          >
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-gray-400">
              <ArrowRight size={20} />
            </div>
          </motion.div>

          {/* Mobile Arrow */}
          <motion.div
            variants={fadeUpVariant}
            className="md:hidden text-gray-300 my-2"
          >
            <ArrowRight size={24} className="rotate-90" />
          </motion.div>

          {/* Step 4 */}
          <motion.div
            variants={scaleUpVariant}
            className="flex flex-col items-center w-40 z-10"
          >
            <div className="w-20 h-20 bg-primary-dark border-4 border-primary-dark rounded-full flex items-center justify-center shadow-lg text-white mb-4 transition-transform hover:scale-110 duration-300">
              <FileText size={32} />
            </div>
            <h4 className="font-bold text-gray-800 text-center text-sm">
              Salary Slips
            </h4>
            <p className="text-[15px] text-gray-500 text-center mt-1">
              PDF Generation
            </p>
          </motion.div>
        </motion.div>
      </div>
      {/* Feature Modules Grid */}
      <div className="mb-24">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage a massive workforce from a single,
            unified dashboard.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeUpVariant}
                className="flex gap-6 p-6 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-blue-50/50 transition-colors duration-300"
              >
                <div className="shrink-0 mt-1">
                  <div className="w-14 h-14 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center text-primary-light">
                    <Icon size={28} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-dark mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {/* Core Principles */}
      <motion.div
        className="bg-gray-900 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Abstract decorative shapes inside the dark card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-danger rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10 text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Our Core Principles
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUpVariant}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 text-white mx-auto flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary-light transition-all duration-300">
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-100 mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
