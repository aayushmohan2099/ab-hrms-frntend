// src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import { Header } from "./PublicComponents/Header";
import { Footer } from "./PublicComponents/Footer";
import { CustomBG } from "./PublicComponents/CustomBG";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans selection:bg-primary-light selection:text-white relative">
      <CustomBG />
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
