import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const PetDetails = () => {
  // Get pet id from route params
  const { id } = useParams();

  // Logged-in user from auth context
  const { user } = useContext(AuthContext);

  // Navigation helper
  const navigate = useNavigate();

  // Pet data state
  const [pet, setPet] = useState(null);

  // Loading state for API call
  const [loading, setLoading] = useState(true);

  // Toast states
  const [toastMsg, setToastMsg] = useState(""); // message text
  const [showToast, setShowToast] = useState(false); // visibility
  const toastRef = useRef(null);

  // Fetch pet details on component mount / id change
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${id}`);
        setPet(res.data);
      } finally {
        // Stop loader whether success or failure
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  // Show toast message for 3 seconds
  const showToastMsg = (msg) => {
    setToastMsg(msg);
    setShowToast(true);

    setTimeout(() => setShowToast(false), 3000);
  };

  // Apply for adoption
  const apply = async () => {
    // If user is not logged in
    if (!user) {
      showToastMsg("Please login to apply.");

      // Redirect to login page after short delay
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      // Submit adoption application
      await api.post(`/adoptions/${id}`);

      showToastMsg("Application submitted successfully!");

      // Redirect to pet list after success
      setTimeout(() => navigate("/"), 2000);
    } catch {
      // Error if already applied or invalid request
      showToastMsg("You already applied or cannot apply.");
    }
  };

  // Loading spinner while fetching pet
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  // If pet not found
  if (!pet) {
    return (
      <div className="container mt-5 text-center text-muted">
        Pet not found
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* TOAST NOTIFICATION */}
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

              {/* PET IMAGE */}
              <div className="text-center mb-4">
                {pet.image && (
                  <img
                    src={`${api.defaults.baseURL}/uploads/${pet.image}`}
                    alt={pet.name}
                    className="pet-details-img"
                  />
                )}
              </div>

              {/* PET DETAILS */}
              <h2 className="mb-3 text-center">{pet.name}</h2>

              <p><strong>Species:</strong> {pet.species}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Age:</strong> {pet.age} year</p>

              <p className="mt-3">
                <strong>Description:</strong> {pet.description}
              </p>

              <hr />

              {/* APPLY BUTTON */}
              <button
                className="btn btn-success"
                onClick={apply}
              >
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
