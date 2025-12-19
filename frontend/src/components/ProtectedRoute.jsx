import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ element: Element, role }) => {
  // Get current logged-in user from AuthContext
  const { user } = useContext(AuthContext);

  // Controls visibility of unauthorized toast message
  const [showToast, setShowToast] = useState(false);

  // Used to delay redirect so user can read the message
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    // Run role check only when user exists and role restriction is provided
    if (user && role) {
      // Support both single role and array of roles
      const allowed = Array.isArray(role)
        ? role.includes(user.role)
        : user.role === role;

      // If user does not have required role
      if (!allowed) {
        setShowToast(true);

        // Delay redirect so toast & message are visible
        const timer = setTimeout(() => setRedirect(true), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [user, role]);

  // If user is not logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  // If user is logged in but NOT authorized
  if (
    role &&
    (!Array.isArray(role)
      ? user.role !== role
      : !role.includes(user.role))
  ) {
    // Redirect to home after delay
    if (redirect) return <Navigate to="/" replace />;

    return (
      <>
        {/* Bootstrap toast for unauthorized access */}
        <div
          className={`toast position-fixed top-0 end-0 m-3 ${
            showToast ? "show" : "hide"
          }`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 9999 }}
        >
          <div className="toast-header">
            <strong className="me-auto">Unauthorized</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
            />
          </div>
          <div className="toast-body">
            You are not authorized to access this page.
          </div>
        </div>

        {/* Informational card shown on page before redirect */}
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-warning shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title text-warning">
                    Access Denied
                  </h5>
                  <p className="card-text">
                    Sorry, you do not have permission to view this page.
                  </p>
                  <p className="text-muted">
                    You will be redirected to the home page shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Authorized user → render the protected component
  return <Element />;
};

export default ProtectedRoute;
