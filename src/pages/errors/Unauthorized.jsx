import { Link } from "react-router-dom";
import { GovButton } from "../../components/ui/GovButton";
import { GovCard } from "../../components/ui/GovCard";
import { AlertTriangle } from "lucide-react";

export function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <GovCard className="max-w-md text-center py-10">
        <div className="flex justify-center mb-4 text-danger">
          <AlertTriangle size={64} />
        </div>
        <h1 className="text-4xl font-bold text-danger mb-4">403 Unauthorized</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You do not have the required permissions to view this page.
        </p>
        <Link to="/">
          <GovButton variant="outline">Return to Home</GovButton>
        </Link>
      </GovCard>
    </div>
  );
}
