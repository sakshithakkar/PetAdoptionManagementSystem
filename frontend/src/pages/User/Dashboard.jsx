import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyApplications from "./MyApplications";
import api from "../../api/axios";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/adoptions/me");
        const apps = res.data;

        const approved = apps.filter(a => a.status === "APPROVED").length;
        const rejected = apps.filter(a => a.status === "REJECTED").length;
        const pending = apps.filter(a => a.status === "PENDING").length;

        setStats({
          total: apps.length,
          approved,
          rejected,
          pending,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Hello, {user.name}</h2>
      <p className="text-muted mb-4">Your adoption dashboard</p>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <div className="card text-white bg-primary h-100">
            <div className="card-body text-center">
              <h5>Total Applications</h5>
              <h3>{stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-2">
          <div className="card text-white bg-success h-100">
            <div className="card-body text-center">
              <h5>Approved</h5>
              <h3>{stats.approved}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-2">
          <div className="card text-white bg-danger h-100">
            <div className="card-body text-center">
              <h5>Rejected</h5>
              <h3>{stats.rejected}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-2">
          <div className="card text-dark bg-warning h-100">
            <div className="card-body text-center">
              <h5>Pending</h5>
              <h3>{stats.pending}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <MyApplications />
    </div>
  );
};

export default UserDashboard;
