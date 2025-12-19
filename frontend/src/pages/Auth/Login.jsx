import { useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // State to store form input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading state to disable button & show spinner
  const [loading, setLoading] = useState(false);

  // Alert state for showing error/success messages
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Get login function from AuthContext
  const { login } = useContext(AuthContext);

  // Used to navigate after successful login
  const navigate = useNavigate();

  // Helper function to show alert temporarily
  const showAlert = (type, message) => {
    setAlert({ type, message });

    // Auto-hide alert after 3 seconds
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      setLoading(true);

      // Call backend login API
      const res = await api.post("/auth/login", { email, password });

      // Extract token from response
      const token = res.data.token;

      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Save user + token using AuthContext
      login(
        { id: payload.id, role: payload.role, name: payload.name },
        token
      );

      // Redirect based on user role
      payload.role === "ADMIN"
        ? navigate("/admin/dashboard")
        : navigate("/dashboard");

    } catch {
      // Show error if login fails
      showAlert("danger", "Invalid email or password");
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="text-center mb-4">Login</h3>

              {/* Alert message (shown only when alert.message exists) */}
              {alert.message && (
                <div className={`alert alert-${alert.type}`}>
                  {alert.message}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
