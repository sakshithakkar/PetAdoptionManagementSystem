import { useEffect, useState } from "react";
import api from "../../api/axios";

const MyApplications = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get("/adoptions/me").then(res => setApps(res.data));
  }, []);

  const getBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "badge bg-success";
      case "REJECTED":
        return "badge bg-danger";
      case "PENDING":
      default:
        return "badge bg-warning text-dark";
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">My Adoption Applications</h2>

      {apps.length === 0 ? (
        <p className="text-center">You have not applied for any pets yet.</p>
      ) : (
        <ul className="list-group">
          {apps.map((a) => (
            <li
              key={a.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{a.name} ({a.breed} - {a.species})</span>
              <span className={getBadgeClass(a.status)}>{a.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyApplications;
