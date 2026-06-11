import { Link } from "react-router-dom";
import { GovButton } from "../../components/ui/GovButton";
import { GovCard } from "../../components/ui/GovCard";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <GovCard className="max-w-md text-center py-10">
        <h1 className="text-6xl font-bold text-primary-dark mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <GovButton variant="primary">Return to Home</GovButton>
        </Link>
      </GovCard>
    </div>
  );
}
