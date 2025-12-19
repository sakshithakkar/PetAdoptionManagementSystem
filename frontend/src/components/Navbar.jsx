import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  // Get logged-in user info and logout handler from AuthContext
  const { user, logout } = useContext(AuthContext);

  return (
    // Main bootstrap navbar
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      
      {/* Brand / App name - navigates to home (Pet list) */}
      <Link className="navbar-brand" to="/">
        Pet Adoption
      </Link>

      {/* Mobile hamburger button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      {/* Collapsible navbar content */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

          {/* Public link - visible to everyone */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Pets
            </NavLink>
          </li>

          {/* Show Login & Register only when user is NOT logged in */}
          {!user && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </li>
            </>
          )}

          {/* Logged-in user navigation */}
          {user && (
            <>
              {/* Normal USER dashboard */}
              {user.role === "USER" && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
              )}

              {/* ADMIN-only navigation */}
              {user.role === "ADMIN" && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/dashboard">
                      Dashboard
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/pets">
                      Manage Pets
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/applications">
                      Applications
                    </NavLink>
                  </li>
                </>
              )}

              {/* Friendly greeting to show who is logged in */}
              <li className="nav-item d-flex align-items-center">
                <span className="navbar-text text-light me-3">
                  👋 Hello, {user.name || "User"}
                </span>
              </li>

              {/* Logout button */}
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
