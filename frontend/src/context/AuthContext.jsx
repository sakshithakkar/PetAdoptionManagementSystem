import { createContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "bootstrap";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const showToast = (message) => {
    const toastEl = toastRef.current;
    if (!toastEl) return;

    toastEl.querySelector(".toast-body").innerText = message;

    const toast = new Toast(toastEl, {
      delay: 2500,
      autohide: true,
    });

    toast.show();
  };

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);

    showToast("You have been logged out successfully.");

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}

      {/* REAL BOOTSTRAP TOAST */}
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
        <div className="toast-body text-dark"></div>
      </div>
    </AuthContext.Provider>
  );
};
