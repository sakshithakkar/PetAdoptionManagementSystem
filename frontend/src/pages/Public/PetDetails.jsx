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

  // Toast state
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

  const showBootstrapToast = (message) => {
    setToastMsg(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // auto hide
  };

  const apply = async () => {
    if (!user) {
      showBootstrapToast("Please login to apply for adoption.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      await api.post(`/adoptions/${id}`);
      showBootstrapToast("Applied for adoption successfully!");
    } catch {
      showBootstrapToast("You have already applied or cannot apply.");
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
      {/* Bootstrap Toast */}
      <div
        className={`toast position-fixed top-0 end-0 m-3 ${
          showToast ? "show" : "hide"
        }`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref={toastRef}
      >
        <div className="toast-header">
          <strong className="me-auto">Notification</strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
        <div className="toast-body">{toastMsg}</div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="mb-3">{pet.name}</h2>

              <p className="text-muted mb-2">
                <strong>Species:</strong> {pet.species}
              </p>

              <p className="text-muted mb-2">
                <strong>Breed:</strong> {pet.breed}
              </p>

              <p className="text-muted mb-2">
                <strong>Age:</strong> {pet.age} year
              </p>

              <p className="mt-3"><strong>Description:</strong> {pet.description}</p>

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
