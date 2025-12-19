import { useEffect, useState } from "react";
import api from "../../api/axios";

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyApps();
  }, []);

  const fetchMyApps = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/adoptions/me");
      setApps(res.data);
    } catch {
      setError("Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "badge bg-success";
      case "REJECTED":
        return "badge bg-danger";
      default:
        return "badge bg-warning text-dark";
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">My Adoption Applications</h2>

      {/* ERROR ALERT */}
      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {/* LOADER */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" />
        </div>
      )}

      {!loading && (
        <>
          {apps.length === 0 ? (
            <div className="card text-center p-4">
              <p className="mb-0 text-muted">
                You have not applied for any pets yet.
              </p>
            </div>
          ) : (
            <div className="card shadow-sm">
              <ul className="list-group list-group-flush">
                {apps.map((a) => (
                  <li
                    key={a.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{a.name}</strong>
                      <div className="text-muted small">
                        {a.breed} • {a.species}
                      </div>
                    </div>

                    <span className={getBadgeClass(a.status)}>
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyApplications;
