import { useEffect, useState } from "react";
import api from "../../api/axios";

const MyApplications = () => {
  // State to store the user's adoption applications
  const [apps, setApps] = useState([]);
  
  // Loading state to show a spinner while fetching data
  const [loading, setLoading] = useState(false);
  
  // Error state to show any fetch-related errors
  const [error, setError] = useState("");

  // Fetch applications on component mount
  useEffect(() => {
    fetchMyApps();
  }, []);

  // Function to fetch current user's adoption applications
  const fetchMyApps = async () => {
    try {
      setLoading(true);   // Start loader
      setError("");       // Clear any previous errors
      const res = await api.get("/adoptions/me"); // API call
      setApps(res.data);  // Save response data to state
    } catch {
      setError("Failed to load your applications."); // Show error message
    } finally {
      setLoading(false);  // Stop loader
    }
  };

  // Function to determine the badge class based on application status
  const getBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "badge bg-success";
      case "REJECTED":
        return "badge bg-danger";
      default:
        return "badge bg-warning text-dark"; // Pending or other statuses
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

      {/* DISPLAY APPLICATIONS */}
      {!loading && (
        <>
          {apps.length === 0 ? (
            // Show message if user has no applications
            <div className="card text-center p-4">
              <p className="mb-0 text-muted">
                You have not applied for any pets yet.
              </p>
            </div>
          ) : (
            // List of applications
            <div className="card shadow-sm">
              <ul className="list-group list-group-flush">
                {apps.map((a) => (
                  <li
                    key={a.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {/* Pet info */}
                    <div>
                      <strong>{a.name}</strong>
                      <div className="text-muted small">
                        {a.breed} • {a.species}
                      </div>
                    </div>

                    {/* Status badge */}
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
