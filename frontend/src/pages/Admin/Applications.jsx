import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  // Store list of adoption applications
  const [apps, setApps] = useState([]);

  // Global loading state for fetch & actions
  const [loading, setLoading] = useState(false);

  // Alert state for success / error messages
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Used to navigate to pet details page
  const navigate = useNavigate();

  // Fetch applications on initial page load
  useEffect(() => {
    fetchApps();
  }, []);

  // Show bootstrap alert with auto-dismiss
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  // Fetch all adoption applications (Admin)
  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await api.get("/adoptions");
      setApps(res.data);
    } catch {
      showAlert("danger", "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Update application status (APPROVED / REJECTED)
  const update = async (id, status) => {
    try {
      setLoading(true);
      await api.put(`/adoptions/${id}`, { status });

      showAlert(
        "success",
        `Application ${status.toLowerCase()} successfully`
      );

      // Refresh list after update
      fetchApps();
    } catch {
      showAlert("danger", "Action failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Adoption Applications</h2>

      {/* Alert message */}
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`}>
          {alert.message}
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" />
        </div>
      )}

      {/* Applications table */}
      {!loading && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Pet</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Empty state */}
              {apps.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No applications found
                  </td>
                </tr>
              )}

              {/* Application rows */}
              {apps.map((a, index) => (
                <tr key={a.id}>
                  <td>{index + 1}</td>

                  {/* Applicant name */}
                  <td>{a.user}</td>

                  {/* Clickable pet name → navigates to pet details */}
                  <td
                    className="clickable-link"
                    onClick={() => navigate(`/pets/${a.petId}`)}
                  >
                    {a.pet}
                  </td>

                  {/* Status badge */}
                  <td>
                    <span
                      className={`badge 
                        ${
                          a.status === "APPROVED"
                            ? "bg-success"
                            : a.status === "REJECTED"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-success me-2"
                      disabled={a.status === "APPROVED" || loading}
                      onClick={() => update(a.id, "APPROVED")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      disabled={a.status === "REJECTED" || loading}
                      onClick={() => update(a.id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;
