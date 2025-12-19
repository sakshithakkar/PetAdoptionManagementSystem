import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // Form input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [loading, setLoading] = useState(false); // disables form + shows spinner
  const [alert, setAlert] = useState({ type: "", message: "" }); // feedback message

  // Used for redirecting after successful registration
  const navigate = useNavigate();

  // Helper function to show alerts temporarily
  const showAlert = (type, message) => {
    setAlert({ type, message });

    // Clear alert after 3 seconds
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  // Handle register form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      setLoading(true);

      // Call backend register API
      await api.post("/auth/register", { name, email, password });

      // Show success message
      showAlert(
        "success",
        "Registered successfully! Redirecting to login..."
      );

      // Redirect to login after short delay
      setTimeout(() => navigate("/login"), 1500);

    } catch {
      // Show error if registration fails
      showAlert("danger", "Registration failed. Email may already exist.");
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
              <h3 className="text-center mb-4">Register</h3>

              {/* Alert message (shown only when alert.message exists) */}
              {alert.message && (
                <div className={`alert alert-${alert.type}`}>
                  {alert.message}
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                {/* Name Input */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

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
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Create password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  className="btn btn-success w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
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

export default Register;
