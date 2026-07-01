// src/layouts/PublicComponents/Footer.jsx
import { Link } from "react-router-dom";
import { MapPin, Mail } from "lucide-react";
import logo from "../../assets/AB_LOGO_NOBG.png";

export function Footer() {
  return (
    <footer className="bg-white border-t-4 border-primary-dark mt-auto relative z-10 pt-12 pb-6 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
      {/* Decorative Top Accent Line */}
      <div className="w-full h-1.5 bg-gradient-to-r from-primary-dark via-primary-light to-primary-dark absolute top-0 left-0"></div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">
          {/* Column 1: Logo & Socials */}
          <div className="flex flex-col items-start">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={logo}
                alt="AB Enterprise"
                className="h-16 w-16 object-contain flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              <div>
                <h3
                  className="text-2xl font-extrabold text-primary-dark leading-none"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  AB Enterprise
                </h3>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-danger">
                  Manpower Solutions
                </p>
              </div>
            </Link>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-primary-dark font-bold text-lg mb-6 relative inline-block">
              Services
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary-light"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Elderly Care Taker Services
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Contractual (Flexi) Staffing
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Permanent Recruitment
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  IT Staffing
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Technical & Non-Technical Staffing
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Payroll Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-primary-dark font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary-light"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Career
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-primary-light text-sm font-medium transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-primary-dark font-bold text-lg mb-6 relative inline-block">
              Contact us
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary-light"></span>
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin
                  size={18}
                  className="text-primary-light shrink-0 mt-0.5"
                />
                <div>
                  <span className="font-bold text-gray-800 block mb-1">
                    Head Office
                  </span>
                  Kensvilla, 204 - 2nd Floor,
                  <br />
                  Above Darshan Hotel,
                  <br />
                  Ramsana Circle, Highway Road,
                  <br />
                  Mehsana - 384002
                </div>
              </div>

              {/* <div className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin
                  size={18}
                  className="text-primary-light shrink-0 mt-0.5"
                />
                <div>
                  <span className="font-bold text-gray-800 block mb-1">
                    Corporate Office
                  </span>
                  2nd Floor, Shiva Plaza,
                  <br />
                  Engineering College, Aliganj,
                  <br />
                  Lucknow - 226021
                </div>
              </div> */}

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={18} className="text-primary-light shrink-0" />
                <a
                  href="mailto:abenterpriselko@gmail.com"
                  className="hover:text-primary-light font-medium transition-colors"
                >
                  abenterpriselko@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policy */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 hover:text-primary-dark font-medium">
            &copy;{" "}
            <a href="https://ab-enterprise.com/">
              AB Enterprise, All Rights Reserved.
            </a>
          </div>
          <div className="text-sm">
            <Link
              to="#"
              className="text-gray-500 hover:text-primary-dark font-medium transition-colors"
            >
              <a href="http://technohorizon.co.in/">
                Design and Maintained by TechnoHorizon
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
