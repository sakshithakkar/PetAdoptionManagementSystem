import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        Pet Adoption
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Pets
            </NavLink>
          </li>

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

          {user && (
            <>
              {user.role === "USER" && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
              )}

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

              {/* Greeting instead of tab */}
              <li className="nav-item d-flex align-items-center">
                <span className="navbar-text text-light me-3">
                  👋 Hello, {user.name || "User"}
                </span>
              </li>

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
