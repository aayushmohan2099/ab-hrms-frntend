// src/layouts/PublicLayout.jsx
import { Outlet, Link, useLocation } from "react-router-dom";
import logo from "../assets/AB_logo.png";

export function PublicLayout() {
  const location = useLocation();

  // Helper to determine active link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans selection:bg-primary-light selection:text-white">
      {/* Changing Gradient Top Bar */}
      <style>
        {`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 8s ease infinite;
          }
        `}
      </style>
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-gradient-to-r from-primary-dark via-primary-light to-primary-dark animate-gradient-x shadow-sm"></div>

      {/* Main Navigation Header - Set to white to match the logo styling */}
      <header className="bg-white sticky top-0 z-40 border-b-2 border-gray-200 shadow-sm mt-1.5 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo Section styled precisely according to the uploaded asset */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-light rounded-md"
          >
            <img
              src={logo}
              alt="AB Logo Star"
              className="h-12 sm:h-14 object-contain transition-transform group-hover:scale-105 duration-300"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="flex flex-col justify-center mt-1">
              <span
                className="text-primary-dark font-extrabold text-2xl sm:text-3xl tracking-tight leading-none"
                style={{ fontFamily: "Georgia, serif" }}
              >
                AB Enterprise
              </span>
              <div className="w-full h-px bg-primary-dark my-1 opacity-20"></div>
              <span className="text-danger font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase leading-none">
                Manpower Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link
              to="/"
              className={`relative py-2 transition-colors duration-200 ${
                isActive("/")
                  ? "text-primary-dark font-bold"
                  : "text-gray-600 hover:text-primary-dark"
              }`}
            >
              Home
              {isActive("/") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-light rounded-t-md"></span>
              )}
            </Link>
            <Link
              to="/about"
              className={`relative py-2 transition-colors duration-200 ${
                isActive("/about")
                  ? "text-primary-dark font-bold"
                  : "text-gray-600 hover:text-primary-dark"
              }`}
            >
              About
              {isActive("/about") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-light rounded-t-md"></span>
              )}
            </Link>
            <Link
              to="/support"
              className={`relative py-2 transition-colors duration-200 ${
                isActive("/support")
                  ? "text-primary-dark font-bold"
                  : "text-gray-600 hover:text-primary-dark"
              }`}
            >
              Support
              {isActive("/support") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-light rounded-t-md"></span>
              )}
            </Link>

            <div className="w-px h-5 bg-gray-300 mx-2"></div>

            <Link
              to="/login"
              className="bg-primary-dark text-white hover:bg-primary-light font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light rounded px-4 py-2 shadow-sm"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="bg-primary-dark border-t-4 border-primary-dark mt-auto relative z-10">
        <div className="w-full h-2 bg-primary-light absolute top-0 left-0"></div>
        <div className="container mx-auto px-6 py-8 mt-2 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide uppercase">
              AB Enterprise <span className="text-danger mx-1">•</span> Manpower
              Solutions
            </span>
          </div>
          <div className="text-sm text-white font-medium">
            &copy; {new Date().getFullYear()} All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
