import { useEffect, useState } from "react";
import api from "../../api/axios";

const Applications = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const res = await api.get("/adoptions");
    setApps(res.data);
  };

  const update = async (id, status) => {
    await api.put(`/adoptions/${id}`, { status });
    fetchApps(); // refresh list after action
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Adoption Applications</h2>

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
                      ${a.status === "APPROVED" ? "bg-success" :
                        a.status === "REJECTED" ? "bg-danger" :
                        "bg-warning text-dark"}`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-success me-2"
                    disabled={a.status === "APPROVED"}
                    onClick={() => update(a.id, "APPROVED")}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    disabled={a.status === "REJECTED"}
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
    </div>
  );
};

export default Applications;
