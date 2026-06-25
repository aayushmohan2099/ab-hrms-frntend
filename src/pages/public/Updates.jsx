// src/pages/Updates.jsx
import { useState, useRef, useEffect } from "react";
import { GovCard } from "../../components/ui/GovCard";
import { GovButton } from "../../components/ui/GovButton";
import {
  Newspaper,
  PauseCircle,
  PlayCircle,
  FileText,
  ExternalLink,
  UserPlus,
  MessageSquare,
  UploadCloud,
  CheckCircle,
  BellRing,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import headerImg from "../../assets/SlideShow/slide_10.png";

// Static mock data for news updates
const NEWS_ITEMS = [
  {
    id: 1,
    date: "15 Jun 2026",
    title:
      "Updated Guidelines for Flexible Contractual Staffing 2026-2027 released.",
    link: "#",
  },
  {
    id: 2,
    date: "10 Jun 2026",
    title:
      "Notice regarding revision in EPF contribution calculations for active employees.",
    link: "#",
  },
  {
    id: 3,
    date: "05 Jun 2026",
    title:
      "List of upcoming declared state holidays for Q3 2026 available for download.",
    link: "#",
  },
  {
    id: 4,
    date: "28 May 2026",
    title: "Urgent: Mandatory Aadhaar seeding extended deadline notification.",
    link: "#",
  },
  {
    id: 5,
    date: "20 May 2026",
    title:
      "New comprehensive medical insurance (ESIC) claiming process documented.",
    link: "#",
  },
  {
    id: 6,
    date: "12 May 2026",
    title: "Annual performance review and increment cycle schedule published.",
    link: "#",
  },
  {
    id: 7,
    date: "01 May 2026",
    title:
      "Changes in Maternity Leave application workflow effective immediately.",
    link: "#",
  },
];

export function Updates() {
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

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

  const stepVariant = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Steps data for the How to Apply section
  const applicationSteps = [
    {
      icon: UserPlus,
      title: "Initial Registration",
      description:
        "Navigate to the official Sewayojan portal. Create your profile, complete your educational details, and apply for your desired post through the government gateway.",
      actionLabel: "Visit Sewayojan Portal",
      actionLink: "https://sewayojan.up.nic.in/IEP/Login.aspx",
      color: "text-primary-light",
    },
    {
      icon: MessageSquare,
      title: "Receive Notification",
      description:
        "Once your application is shortlisted from the portal, you will receive an official SMS or WhatsApp message from AB Enterprise within 24-48 hours initiating the onboarding process.",
      actionLabel: null,
      actionLink: null,
      color: "text-secondary",
    },
    {
      icon: UploadCloud,
      title: "Submit Documents",
      description:
        "Click the secure link provided in your SMS/WhatsApp message. You will be redirected to the AB Enterprise Document Portal. Use your registered mobile number or email for OTP verification to upload your KYC and educational documents safely.",
      actionLabel: null,
      actionLink: null,
      color: "text-warning",
    },
    {
      icon: CheckCircle,
      title: "Final Confirmation",
      description:
        "Upon successful verification of your documents, you will receive a unique AB Enterprise Candidate ID. Keep this ID safe, as it will be required for all future communications, background checks, and tracking your final employment status.",
      actionLabel: null,
      actionLink: null,
      color: "text-green-600",
    },
  ];

  return (
    <div className="px-10 py-10 sm:py-16 relative z-10 bg-gray-50 min-h-screen">
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
          alt="Updates Background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[320px] items-center justify-center px-6 py-24">
          <motion.div variants={fadeUpVariant} className="text-center mt-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full mb-6">
              <BellRing size={32} />
            </div>
            <h1
              className="max-w-6xl text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Latest Updates & Circulars
            </h1>
            <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto font-medium leading-relaxed">
              Stay informed with the latest organizational announcements, policy
              changes, and crucial recruitment updates from AB Enterprise.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-10">
        {/* Left Column: News Marquee */}
        <motion.div
          className="lg:col-span-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
        >
          <GovCard className="p-0 overflow-hidden border-t-4 border-t-primary-dark shadow-lg bg-white h-[500px] flex flex-col relative">
            {/* Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center z-10 shadow-sm relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-primary-dark rounded-md">
                  <Newspaper size={20} />
                </div>
                <h2 className="font-bold text-gray-900 text-lg tracking-wide">
                  Notice Board
                </h2>
              </div>
              <button
                onClick={() => setIsMarqueePaused(!isMarqueePaused)}
                className="text-gray-500 hover:text-primary-dark transition-colors focus:outline-none p-1.5 rounded-md hover:bg-gray-200"
                title={isMarqueePaused ? "Play" : "Pause"}
              >
                {isMarqueePaused ? (
                  <PlayCircle size={24} />
                ) : (
                  <PauseCircle size={24} />
                )}
              </button>
            </div>

            {/* Custom CSS for vertical marquee */}
            <style>
              {`
                @keyframes vertical-marquee {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-50%); }
                }
                .animate-vertical-marquee {
                  animation: vertical-marquee 25s linear infinite;
                }
                .marquee-paused {
                  animation-play-state: paused;
                }
              `}
            </style>

            {/* News List Container */}
            <div
              className={`flex-1 relative ${isMarqueePaused ? "overflow-y-auto" : "overflow-hidden"}`}
            >
              {/* Fade overlays for smooth entry/exit when scrolling */}
              {!isMarqueePaused && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                </>
              )}

              <div
                className={`w-full ${!isMarqueePaused ? "animate-vertical-marquee hover:marquee-paused" : ""}`}
              >
                {/* To make the infinite scroll seamless, we duplicate the list 
                  so when it hits 50% translate, it looks exactly like 0%
                */}
                {[...NEWS_ITEMS, ...(isMarqueePaused ? [] : NEWS_ITEMS)].map(
                  (news, index) => (
                    <a
                      key={`${news.id}-${index}`}
                      href={news.link}
                      className="block p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="shrink-0 mt-1">
                          <FileText
                            size={18}
                            className="text-gray-400 group-hover:text-danger transition-colors"
                          />
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded mb-2 border border-gray-200">
                            {news.date}
                          </span>
                          <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-primary-dark transition-colors">
                            {news.title}
                          </p>
                        </div>
                      </div>
                    </a>
                  ),
                )}
              </div>
            </div>
          </GovCard>
        </motion.div>

        {/* Right Column: Application Steps */}
        <motion.div
          className="lg:col-span-7"
          ref={containerRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <div className="mb-8">
            <h2
              className="text-3xl font-extrabold text-primary-dark mb-3"
              style={{ fontFamily: "Georgia, serif" }}
            >
              How to Apply
            </h2>
            <div className="w-16 h-1.5 bg-secondary rounded-full"></div>
            <p className="mt-4 text-gray-600">
              Follow these precise steps to successfully register and complete
              your onboarding process with AB Enterprise.
            </p>
          </div>

          <div className="relative border-l-2 border-gray-200 ml-6 sm:ml-8 space-y-8 pb-4">
            {applicationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={stepVariant}
                  className="relative pl-8 sm:pl-10"
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-gray-50 bg-white flex items-center justify-center shadow-sm ${step.color}`}
                  >
                    <Icon size={14} className="stroke-[3]" />
                  </div>

                  <GovCard className="p-6 border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-extrabold text-danger">
                        STEP {index + 1}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {step.actionLink && (
                      <GovButton
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => window.open(step.actionLink, "_blank")}
                      >
                        {step.actionLabel} <ExternalLink size={14} />
                      </GovButton>
                    )}
                  </GovCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
