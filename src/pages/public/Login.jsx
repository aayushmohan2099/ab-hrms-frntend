import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { GovCard } from "../../components/ui/GovCard";
import { GovInput } from "../../components/ui/GovInput";
import { GovSelect } from "../../components/ui/GovSelect";
import { GovButton } from "../../components/ui/GovButton";
import { Building } from "lucide-react";

export function Login() {
  const [role, setRole] = useState("Administrator");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password || !captchaInput) {
      setError("Please fill in all fields.");
      return;
    }

    if (captchaInput !== captchaCode) {
      setError("Invalid CAPTCHA code. Please try again.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    // Mock Login Success
    login({ username, role });

    // Redirect based on role
    if (role === "Administrator") navigate("/admin/dashboard");
    else if (role === "Manager") navigate("/manager/dashboard");
    else navigate("/employee/dashboard");
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
          <p className="text-sm text-gray-500">National Informatics Centre</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-danger text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <GovSelect
            label="Select Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "Administrator", label: "Administrator" },
              { value: "Manager", label: "Manager" },
              { value: "Employee", label: "Employee" },
            ]}
          />
          <GovInput
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <GovInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Security Code</label>
            <div className="flex gap-3">
              <div 
                className="flex-1 bg-gray-200 flex items-center justify-center text-lg font-mono font-bold tracking-widest text-gray-700 rounded select-none cursor-pointer"
                onClick={generateCaptcha}
                title="Click to refresh CAPTCHA"
              >
                {captchaCode}
              </div>
              <input
                className="flex-1 px-3 py-2 bg-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-dark"
                placeholder="Enter code"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
            </div>
          </div>

          <GovButton type="submit" className="w-full mt-2">
            Sign In
          </GovButton>
        </form>
      </GovCard>
    </div>
  );
}
