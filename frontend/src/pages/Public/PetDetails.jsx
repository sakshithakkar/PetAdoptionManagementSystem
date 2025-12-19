import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${id}`);
        setPet(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const showToastMsg = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const apply = async () => {
    if (!user) {
      showToastMsg("Please login to apply.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await api.post(`/adoptions/${id}`);
      showToastMsg("Application submitted successfully!");
    } catch {
      showToastMsg("You already applied or cannot apply.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mt-5 text-center text-muted">
        Pet not found
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* TOAST */}
      <div
        ref={toastRef}
        className={`toast position-fixed top-0 end-0 m-3 ${
          showToast ? "show" : "hide"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="toast-header">
          <strong className="me-auto">Notice</strong>
          <button
            className="btn-close"
            onClick={() => setShowToast(false)}
          />
        </div>
        <div className="toast-body">{toastMsg}</div>
      </div>

      {/* BACK BUTTON */}
      <button
        className="btn btn-link mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back to list
      </button>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="mb-3">{pet.name}</h2>

              <p><strong>Species:</strong> {pet.species}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Age:</strong> {pet.age} year</p>

              <p className="mt-3">
                <strong>Description:</strong> {pet.description}
              </p>

              <hr />

              <button className="btn btn-success" onClick={apply}>
                Apply for Adoption
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
