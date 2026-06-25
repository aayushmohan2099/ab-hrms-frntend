// src/layouts/PublicComponents/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/AB_LOGO_NOBG.png";

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to determine active link
  const isActive = (path) => location.pathname === path;

  // Toggle mobile menu state
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <style>
        {`
          @keyframes notch-slide-down {
            0% {
              transform: translate(-50%, -150%);
              opacity: 0;
            }
            100% {
              transform: translate(-50%, 0);
              opacity: 1;
            }
          }
          
          .animate-notch {
            animation: notch-slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          
          /* Custom shape mimicking the iPhone notch attached to the top */
          .notch-shape {
            position: relative;
            border-bottom-left-radius: 36px;
            border-bottom-right-radius: 36px;
          }
          
          /* The inverse concave corners connecting the notch to the top edge */
          .notch-shape::before,
          .notch-shape::after {
            content: "";
            position: absolute;
            top: 0;
            width: 36px;
            height: 36px;
            pointer-events: none;
          }
          
          .notch-shape::before {
            left: -36px;
            background: radial-gradient(circle at 0 100%, transparent 36px, white 36px);
          }
          
          .notch-shape::after {
            right: -36px;
            background: radial-gradient(circle at 100% 100%, transparent 36px, white 36px);
          }

          /* Mobile Menu Animation */
          .mobile-menu-enter {
            animation: slideDown 0.3s ease-out forwards;
            transform-origin: top;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: scaleY(0);
            }
            to {
              opacity: 1;
              transform: scaleY(1);
            }
          }
        `}
      </style>

      {/* Floating Notch Header - Made wider to accommodate larger elements */}
      <header className="fixed top-0 left-1/2 z-50 w-full max-w-5xl animate-notch">
        {/* Increased height to 96px (from 60px) and padded proportionately */}
        <div className="bg-white text-gray-300 shadow-2xl notch-shape px-6 sm:px-10 py-4 flex justify-between items-center h-[96px]">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-4 group focus:outline-none rounded-full px-2"
          >
            <img
              src={logo}
              alt="AB Logo Star"
              className="h-14 sm:h-16 object-contain transition-transform group-hover:scale-105 duration-300"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div className="flex flex-col justify-center">
              <span
                className="text-accent-navy font-extrabold text-2xl sm:text-3xl tracking-tight leading-none"
                style={{ fontFamily: "Georgia, serif" }}
              >
                AB Enterprise
              </span>
              <span className="text-danger font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase leading-none mt-1.5">
                Manpower Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Increased text to base and gaps */}
          <nav className="hidden md:flex items-center gap-10 font-medium text-base">
            <Link
              to="/"
              className={`transition-colors duration-200 ${
                isActive("/")
                  ? "text-primary-dark"
                  : "text-gray-400 hover:text-danger"
              }`}
            >
              HOME
            </Link>
            <Link
              to="/latest-updates"
              className={`relative transition-colors duration-200 ${
                isActive("/latest-updates")
                  ? "text-secondary"
                  : "text-gray-400 hover:text-danger"
              }`}
            >
              LATEST UPDATES
              <span className="new-badge absolute -top-2.5 -right-10 rounded-full bg-red-600 px-2 py-[2px] text-[9px] font-extrabold uppercase tracking-widest text-white shadow-lg">
                NEW
              </span>
            </Link>
            <Link
              to="/about"
              className={`transition-colors duration-200 ${
                isActive("/about")
                  ? "text-secondary"
                  : "text-gray-400 hover:text-danger"
              }`}
            >
              ABOUT
            </Link>
            <Link
              to="/support"
              className={`transition-colors duration-200 ${
                isActive("/support")
                  ? "text-secondary"
                  : "text-gray-400 hover:text-danger"
              }`}
            >
              SUPPORT
            </Link>
          </nav>

          {/* Action Button - Desktop */}
          <div className="hidden md:block">
            <Link to="/login">
              <button className="btn-login">LOGIN</button>
            </Link>
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-accent-navy focus:outline-none focus:ring-2 focus:ring-primary-light rounded-md p-1"
            >
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[80px] left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100 overflow-hidden mobile-menu-enter mt-4 py-4 px-6 flex flex-col gap-4 z-40">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-3 font-semibold text-center rounded-lg ${
                isActive("/")
                  ? "bg-blue-50 text-primary-dark"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              HOME
            </Link>
            <Link
              to="/latest-updates"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block relative py-3 font-semibold text-center rounded-lg ${
                isActive("/latest-updates")
                  ? "bg-blue-50 text-primary-dark"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              LATEST UPDATES
              <span className="absolute top-2 right-1/4 translate-x-1/2 rounded-full bg-red-600 px-2 py-[2px] text-[9px] font-extrabold uppercase tracking-widest text-white shadow-sm">
                NEW
              </span>
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-3 font-semibold text-center rounded-lg ${
                isActive("/about")
                  ? "bg-blue-50 text-primary-dark"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              ABOUT
            </Link>
            <Link
              to="/support"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-3 font-semibold text-center rounded-lg ${
                isActive("/support")
                  ? "bg-blue-50 text-primary-dark"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              SUPPORT
            </Link>

            <div className="w-full h-px bg-gray-200 my-2"></div>

            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full py-3 text-center bg-accent-navy text-white font-bold rounded-xl shadow-md active:bg-primary-dark"
            >
              LOGIN TO PORTAL
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
