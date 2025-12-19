import { createContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "bootstrap";

// Create authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Used for programmatic navigation after login/logout
  const navigate = useNavigate();

  // Reference to Bootstrap toast DOM element
  const toastRef = useRef(null);

  // Store logged-in user (persisted from localStorage)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // Show Bootstrap toast with dynamic message
  const showToast = (message) => {
    const toastEl = toastRef.current;
    if (!toastEl) return;

    // Update toast body text
    toastEl.querySelector(".toast-body").innerText = message;

    // Initialize and show Bootstrap toast
    const toast = new Toast(toastEl, {
      delay: 2500,
      autohide: true,
    });

    toast.show();
  };

  // Login handler
  // Stores token & user data, updates context state
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout handler
  // Clears session data, shows toast, redirects to home
  const logout = () => {
    localStorage.clear();
    setUser(null);

    showToast("You have been logged out successfully.");

    // Delay navigation so toast is visible
    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {/* Render entire app */}
      {children}

      {/* Global Bootstrap Toast (used for auth-related messages) */}
      <div
        ref={toastRef}
        className="toast position-fixed top-0 end-0 m-3"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ zIndex: 9999 }}
      >
        <div className="toast-header bg-success text-white">
          <strong className="me-auto">Session</strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="toast"
          />
        </div>

        {/* Message is injected dynamically */}
        <div className="toast-body text-dark"></div>
      </div>
    </AuthContext.Provider>
  );
};
