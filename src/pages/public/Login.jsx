import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../api/authService";
import { GovCard } from "../../components/ui/GovCard";
import { GovInput } from "../../components/ui/GovInput";
import { GovButton } from "../../components/ui/GovButton";
import { Building, RefreshCw } from "lucide-react";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaImage, setCaptchaImage] = useState(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const fetchCaptcha = async () => {
    setIsCaptchaLoading(true);
    try {
      const data = await authService.getCaptcha();
      setCaptchaImage(data.image);
    } catch (err) {
      console.error("Captcha fetch error:", err);
      setError("Failed to load secure captcha. Please check your connection.");
    } finally {
      setIsCaptchaLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !captchaInput) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({
        username,
        password,
        captcha: captchaInput,
      });

      console.log("Login successful:", response);
      const userRole = response.user.role_name;

      if (userRole === "Administrator") {
        navigate("/admin/dashboard");
      } else if (userRole === "Manager") {
        navigate("/manager/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Login failed. Please try again.";
      setError(errorMessage);

      fetchCaptcha();
      setCaptchaInput("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      <div className="absolute top-0 w-full h-64 bg-primary-dark shadow-md" />
      <GovCard className="max-w-md w-full relative z-10 p-8 shadow-2xl border-t-4 border-t-primary-light">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-primary-dark rounded-full mb-4">
            <Building size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">HRMS Portal</h2>
          <p className="text-sm text-gray-500">AB Enterprises</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-danger text-sm rounded border border-red-200 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <GovInput
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <GovInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          {/* Replicating the older Captcha layout using Tailwind */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Captcha
            </label>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-md p-2">
                {isCaptchaLoading || !captchaImage ? (
                  <div className="w-[180px] h-[50px] flex items-center justify-center">
                    <RefreshCw
                      className="animate-spin text-gray-400"
                      size={20}
                    />
                  </div>
                ) : (
                  <img
                    src={captchaImage}
                    alt="Security Captcha"
                    className="w-[180px] h-[50px] block"
                  />
                )}
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  disabled={isCaptchaLoading}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-1.5 px-3 rounded text-sm transition-colors"
                >
                  Refresh
                </button>
              </div>

              <input
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-dark uppercase tracking-[0.2em] text-center font-semibold text-gray-800"
                placeholder="Enter captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                disabled={isLoading}
                maxLength={6}
              />
            </div>
          </div>

          <GovButton
            type="submit"
            className="w-full mt-4"
            disabled={isLoading || isCaptchaLoading}
          >
            {isLoading ? "Authenticating..." : "Log In"}
          </GovButton>
        </form>
      </GovCard>
    </div>
  );
}
