import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  // Get logged-in admin details
  const { user } = useContext(AuthContext);

  // Dashboard statistics state
  const [stats, setStats] = useState({
    totalPets: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0
  });

  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all pets
        const petsRes = await api.get("/pets");
        const pets = petsRes.data;

        // Fetch all adoption applications
        const appsRes = await api.get("/adoptions");
        const apps = appsRes.data;

        // Calculate application statuses
        const pendingApps = apps.filter(
          (a) => a.status === "PENDING"
        ).length;

        const approvedApps = apps.filter(
          (a) => a.status === "APPROVED"
        ).length;

        // Update stats state
        setStats({
          totalPets: pets.length,
          totalApplications: apps.length,
          pendingApplications: pendingApps,
          approvedApplications: approvedApps
        });
      } catch (err) {
        // Log error if API call fails
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-4">
      {/* Greeting */}
      <h2>Hello, {user.name}</h2>
      <p className="text-muted mb-4">Admin dashboard</p>

      {/* Statistics cards */}
      <div className="row mb-4">
        {/* Total Pets */}
        <div className="col-md-3 mb-2">
          <div className="card text-white bg-primary h-100">
            <div className="card-body text-center">
              <h5>Total Pets</h5>
              <h3>{stats.totalPets}</h3>
            </div>
          </div>
        </div>

        {/* Total Applications */}
        <div className="col-md-3 mb-2">
          <div className="card text-white bg-success h-100">
            <div className="card-body text-center">
              <h5>Total Applications</h5>
              <h3>{stats.totalApplications}</h3>
            </div>
          </div>
        </div>

        {/* Approved Applications */}
        <div className="col-md-3 mb-2">
          <div className="card text-dark bg-info h-100">
            <div className="card-body text-center">
              <h5>Approved Applications</h5>
              <h3>{stats.approvedApplications}</h3>
            </div>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="col-md-3 mb-2">
          <div className="card text-dark bg-warning h-100">
            <div className="card-body text-center">
              <h5>Pending Applications</h5>
              <h3>{stats.pendingApplications}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
