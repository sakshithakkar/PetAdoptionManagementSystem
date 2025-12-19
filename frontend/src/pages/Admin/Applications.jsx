import { useEffect, useState } from "react";
import api from "../../api/axios";

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchApps();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

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

  const update = async (id, status) => {
    try {
      setLoading(true);
      await api.put(`/adoptions/${id}`, { status });
      showAlert("success", `Application ${status.toLowerCase()} successfully`);
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

      {/* Bootstrap Alert */}
      {alert.message && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`}>
          {alert.message}
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" />
        </div>
      )}

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
              {apps.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No applications found
                  </td>
                </tr>
              )}

              {apps.map((a, index) => (
                <tr key={a.id}>
                  <td>{index + 1}</td>
                  <td>{a.user}</td>
                  <td>{a.pet}</td>
                  <td>
                    <span
                      className={`badge 
                        ${a.status === "APPROVED"
                          ? "bg-success"
                          : a.status === "REJECTED"
                          ? "bg-danger"
                          : "bg-warning text-dark"}`}
                    >
                      {a.status}
                    </span>
                  </td>
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
