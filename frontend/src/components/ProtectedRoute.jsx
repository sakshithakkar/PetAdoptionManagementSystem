import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ element: Element, role }) => {
  const { user } = useContext(AuthContext);
  const [showToast, setShowToast] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (user && role) {
      const allowed = Array.isArray(role) ? role.includes(user.role) : user.role === role;
      if (!allowed) {
        setShowToast(true);

        // delay redirect so toast is visible
        const timer = setTimeout(() => setRedirect(true), 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [user, role]);

  if (!user) return <Navigate to="/login" replace />;

  if (role && (!Array.isArray(role) ? user.role !== role : !role.includes(user.role))) {
    if (redirect) return <Navigate to="/" replace />;

    return (
      <>
        {/* Toast */}
        <div
          className={`toast position-fixed top-0 end-0 m-3 ${showToast ? "show" : "hide"}`}
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

        {/* Info card on page */}
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-warning shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title text-warning">Access Denied</h5>
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

  return <Element />;
};

export default ProtectedRoute;
