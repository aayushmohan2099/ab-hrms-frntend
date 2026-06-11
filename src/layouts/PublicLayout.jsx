import { Outlet, Link } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-primary-dark text-base py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">AB HRMS Portal</h1>
          <nav className="flex gap-4">
            <Link to="/" className="hover:text-primary-light transition-colors">Home</Link>
            <Link to="/about" className="hover:text-primary-light transition-colors">About</Link>
            <Link to="/support" className="hover:text-primary-light transition-colors">Support</Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} AB Enterprises. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
