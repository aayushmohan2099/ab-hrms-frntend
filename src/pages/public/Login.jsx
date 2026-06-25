import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../api/authService";
import { GovCard } from "../../components/ui/GovCard";
import { GovInput } from "../../components/ui/GovInput";
import { GovButton } from "../../components/ui/GovButton";
import { Building, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import bg from "../../assets/login_bg.png";
import logo from "../../assets/AB_LOGO_NOBG.png";

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
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="max-w-md w-full relative z-10">
        {/* Announcement Marquee */}
        <div className="mb-4 overflow-hidden rounded-lg border-2 border-primary-dark bg-color-base text-primary-dark shadow-lg">
          <marquee
            scrollAmount="4"
            direction="left"
            className="py-2 font-bold text-primary-dark"
          >
            यदि आपको लॉगिन करने में कोई असुविधा हो रही है तो आप हमें दिए गए ईमेल
            आईडी abenterpriselko@gmail.com पर अपना नाम, एम्प्लोयी आईडी, पदनाम
            लिख कर ईमेल करें |
          </marquee>
        </div>

        <GovCard className="p-8 shadow-2xl border-t-4 border-t-primary-light">
          {/* Existing Login Card Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-40 h-40 mb-4">
              {/* <Building size={42} /> */}
              <Link to="/">
                <img
                  src={logo}
                  alt="Logo"
                  className="object-contain drop-shadow-[0_0_3px_#0499DD]"
                />
              </Link>
            </div>
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
              showPasswordToggle
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
                  onChange={(e) =>
                    setCaptchaInput(e.target.value.toUpperCase())
                  }
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
    </div>
  );
}
