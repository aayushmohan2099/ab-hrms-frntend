// src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import { GovPieChart } from "../../components/charts/GovPieChart";
import { GovBarChart } from "../../components/charts/GovBarChart";
import { HomeSSBg } from "../../components/ui/HomeSSBg";
import {
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  UserCircle,
  Building2,
  BarChart3,
} from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion"; // <-- Added scroll hooks

// Helper component for animated numbers
function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = value / (duration / 16); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        clearInterval(timer);
        setCount(value);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return <span ref={nodeRef}>{count.toLocaleString()}</span>;
}

export function Home() {
  // Mock Data for Analytics
  const attendanceData = [
    { name: "Present", value: 85 },
    { name: "Absent", value: 5 },
    { name: "On Leave", value: 10 },
  ];

  const payrollData = [
    { name: "Jan", value: 92 },
    { name: "Feb", value: 95 },
    { name: "Mar", value: 98 },
    { name: "Apr", value: 94 },
    { name: "May", value: 99 },
    { name: "Jun", value: 100 },
  ];

  // Parallax Scroll Hooks
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Animation Variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const scaleUpVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, type: "spring", bounce: 0.4 },
    },
  };

  return (
    <div className="w-full flex-grow flex flex-col relative">
      {/* Background Slideshow covering the entire viewport */}
      <HomeSSBg />

      {/* =========================================
        SECTION 1: HERO & LOGIN PORTALS
        =========================================
      */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] px-4 py-16 sm:py-24">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16 px-4 pt-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ y: heroY, opacity: heroOpacity }} // <-- Applied parallax effect here
        >
          <motion.div
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-8 shadow-sm"
          >
            <CheckCircle2 size={16} className="text-blue-200" />
            <span>Official Personnel Portal</span>
          </motion.div>

          <motion.h1
            variants={fadeUpVariant}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.15]"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
          >
            Human Resource Management System
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-medium"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
          >
            A secure, centralized platform for managing personnel profiles,
            attendance workflows, and precise payroll operations with absolute
            transparency.
          </motion.p>
        </motion.div>

        {/* Action Cards Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-5xl px-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Employee Card */}
          <motion.div variants={scaleUpVariant} className="h-full">
            <GovCard className="group relative bg-white/95 backdrop-blur-md p-8 sm:p-10 border border-white/40 hover:border-primary-light/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-2xl overflow-hidden text-left flex flex-col h-full">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-light scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>

              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-primary-light group-hover:text-white transition-colors duration-300 text-primary-light shadow-sm">
                <Users size={32} strokeWidth={2.5} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Employee Self Service
              </h2>
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed text-base">
                Access your personal employment profile, review daily attendance
                records, submit leave requests, and securely download your
                monthly wage slips.
              </p>

              <div className="pt-4 mt-auto border-t border-gray-100">
                <Link to="/login" className="block outline-none">
                  <GovButton className="w-full sm:w-auto gap-2 group-hover:bg-accent-navy transition-colors text-base font-semibold shadow-sm px-8 py-3">
                    Access Portal{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </GovButton>
                </Link>
              </div>
            </GovCard>
          </motion.div>

          {/* Admin / Manager Card */}
          <motion.div variants={scaleUpVariant} className="h-full">
            <GovCard className="group relative bg-white/95 backdrop-blur-md p-8 sm:p-10 border border-white/40 hover:border-primary-dark/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-2xl overflow-hidden text-left flex flex-col h-full">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-dark scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>

              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100 group-hover:bg-primary-dark group-hover:text-white transition-colors duration-300 text-primary-dark shadow-sm">
                <ShieldCheck size={32} strokeWidth={2.5} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Administrative Control
              </h2>
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed text-base">
                Comprehensive tools designed for department managers and system
                administrators to oversee personnel operations, manage
                approvals, and execute payroll runs.
              </p>

              <div className="pt-4 mt-auto border-t border-gray-100">
                <Link to="/login" className="block outline-none">
                  <GovButton
                    variant="outline"
                    className="w-full sm:w-auto gap-2 border-gray-300 text-gray-700 hover:border-primary-dark hover:text-primary-dark hover:bg-indigo-50 transition-colors text-base font-semibold px-8 py-3"
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
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================
        SECTION 2: KPI & ANALYTICS OVERVIEW
        =========================================
      */}
      <section className="relative z-20 bg-gray-50 pt-20 pb-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUpVariant}
              className="text-3xl sm:text-4xl font-extrabold text-primary-dark tracking-tight mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Workforce at a Glance
            </motion.h2>
            <motion.div
              variants={fadeUpVariant}
              className="w-20 h-1.5 bg-danger mx-auto rounded-full mb-4"
            ></motion.div>
            <motion.p
              variants={fadeUpVariant}
              className="text-gray-600 max-w-2xl mx-auto text-lg"
            >
              Empowering organizations with real-time tracking, seamless payroll
              execution, and comprehensive personnel distribution.
            </motion.p>
          </motion.div>

          {/* 5 KPI Cards (Onboarded Users) */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* KPI 1 */}
            <motion.div variants={scaleUpVariant}>
              <GovCard className="p-6 text-center border-0 shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-blue-50 text-primary-light rounded-full flex items-center justify-center mb-3">
                  <Users size={24} />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  <AnimatedCounter value={12450} />
                </div>
                <div className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Total Employees
                </div>
              </GovCard>
            </motion.div>

            {/* KPI 2 */}
            <motion.div variants={scaleUpVariant}>
              <GovCard className="p-6 text-center border-0 shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-indigo-50 text-primary-dark rounded-full flex items-center justify-center mb-3">
                  <Briefcase size={24} />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  <AnimatedCounter value={45} />
                </div>
                <div className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  State Level Staff
                </div>
              </GovCard>
            </motion.div>

            {/* KPI 3 */}
            <motion.div variants={scaleUpVariant}>
              <GovCard className="p-6 text-center border-0 shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3">
                  <UserCircle size={24} />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  <AnimatedCounter value={125} />
                </div>
                <div className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Data Operators
                </div>
              </GovCard>
            </motion.div>

            {/* KPI 4 */}
            <motion.div variants={scaleUpVariant}>
              <GovCard className="p-6 text-center border-0 shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
                  <Building2 size={24} />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  <AnimatedCounter value={14} />
                </div>
                <div className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Dept. Admins
                </div>
              </GovCard>
            </motion.div>

            {/* KPI 5 */}
            <motion.div variants={scaleUpVariant}>
              <GovCard className="p-6 text-center border-0 shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-red-50 text-danger rounded-full flex items-center justify-center mb-3">
                  <ShieldCheck size={24} />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  <AnimatedCounter value={6} />
                </div>
                <div className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  HR Executives
                </div>
              </GovCard>
            </motion.div>
          </motion.div>

          {/* Analytics Charts */}
          <motion.div
            className="grid lg:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Pie Chart */}
            <motion.div variants={fadeUpVariant}>
              <GovCard className="p-6 sm:p-8 bg-white border-0 shadow-lg h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-blue-50 text-primary-light rounded-lg">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Today's Attendance
                    </h3>
                    <p className="text-xs text-gray-500">
                      Live operational workforce distribution
                    </p>
                  </div>
                </div>
                <div className="flex-grow flex items-center justify-center">
                  <GovPieChart data={attendanceData} height={320} />
                </div>
              </GovCard>
            </motion.div>

            {/* Bar Chart */}
            <motion.div variants={fadeUpVariant}>
              <GovCard className="p-6 sm:p-8 bg-white border-0 shadow-lg h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="p-2 bg-indigo-50 text-primary-dark rounded-lg">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Payroll Execution Rate
                    </h3>
                    <p className="text-xs text-gray-500">
                      Slips generated accurately on time
                    </p>
                  </div>
                </div>
                <div className="flex-grow flex items-center justify-center">
                  <GovBarChart
                    data={payrollData}
                    height={320}
                    valueSuffix="%"
                    color="#0499DD" // primary-light
                  />
                </div>
              </GovCard>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
