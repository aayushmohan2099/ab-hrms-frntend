// src/contexts/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../api/authService";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Set default header for initial load
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Wrapped in useCallback so it can be safely used inside the idle timer useEffect
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    delete api.defaults.headers.common["Authorization"];

    // Force a hard redirect to clear memory and routing state
    window.location.href = "/login?reason=timeout";
  }, []);

  // =================================================================
  // 🕒 15-MINUTE INACTIVITY TRACKER
  // =================================================================
  useEffect(() => {
    // Only run the timer if the user is actually logged in
    if (!user) return;

    let timeoutId;
    // 15 minutes in milliseconds (15 * 60 * 1000)
    const IDLE_TIMEOUT_MS = 900000;

    // Function to restart the clock
    const resetIdleTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        console.warn("User inactive for 15 minutes. Forcing logout.");
        logout();
      }, IDLE_TIMEOUT_MS);
    };

    // DOM events that qualify as "User Activity"
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    // Attach the reset function to all activity events
    activityEvents.forEach((event) => {
      document.addEventListener(event, resetIdleTimer);
    });

    // Start the initial countdown
    resetIdleTimer();

    // Cleanup phase: Remove listeners and clear timers if component unmounts or user logs out
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
