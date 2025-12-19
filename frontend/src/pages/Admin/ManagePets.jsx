import { useEffect, useState } from "react";
import api from "../../api/axios";

const initialForm = {
  name: "",
  species: "",
  breed: "",
  age: "",
  description: "",
  image: null, // new field for image
};

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10); // pets per page
  const [totalPets, setTotalPets] = useState(0);

  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchPets();
  }, [page]);

  console.log(api.defaults.baseURL, ' upload')

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pets", { params: { page, limit } });
      setPets(res.data.pets || res.data); // adjust based on API
      setTotalPets(res.data.total || res.data.length);
    } catch {
      showAlert("danger", "Failed to fetch pets");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Prepare FormData for image upload
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("species", form.species);
      formData.append("breed", form.breed);
      formData.append("age", form.age);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      if (editingId) {
        await api.put(`/pets/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("success", "Pet updated successfully");
      } else {
        await api.post("/pets", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("success", "Pet added successfully");
      }

      setForm(initialForm);
      setEditingId(null);
      setShowModal(false);
      fetchPets();
    } catch {
      showAlert("danger", "Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/pets/${id}`);
      showAlert("success", "Pet deleted successfully");
      fetchPets();
    } catch {
      showAlert("danger", "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const edit = (pet) => {
    setEditingId(pet.id);
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      description: pet.description,
      image: null, // reset image for editing
    });
    setShowModal(true);
  };

  const totalPages = Math.ceil(totalPets / limit);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Pets</h2>

      {/* ALERT */}
      {alert.message && (
        <div className={`alert alert-${alert.type} fade show`}>
          {alert.message}
        </div>
      )}

      {/* LOADER */}
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" />
        </div>
      )}

      {/* ADD PET BUTTON */}
      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingId(null);
            setForm(initialForm);
            setShowModal(true);
          }}
        >
          Add New Pet
        </button>
      </div>

      {/* PET LIST */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Image</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No pets found
                </td>
              </tr>
            )}

            {pets.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.species}</td>
                <td>{p.breed}</td>
                <td>{p.age}</td>
                <td>
                  {p.image ? (
                    <img
                      src={`${api.defaults.baseURL}/uploads/${p.image}`}
                      alt={p.name}
                      className="pet-thumb"
                      onClick={() => {
                        setPreviewImage(
                          p.image
                            ? `${api.defaults.baseURL}/uploads/${p.image}`
                            : null
                        );
                        setShowImageModal(true);
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => edit(p)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => remove(p.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 && "disabled"}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 && "active"}`}
              >
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${page === totalPages && "disabled"}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* MODAL */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? "Edit Pet" : "Add New Pet"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Species</label>
                  <input
                    className="form-control"
                    value={form.species}
                    onChange={(e) =>
                      setForm({ ...form, species: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Breed</label>
                  <input
                    className="form-control"
                    value={form.breed}
                    onChange={(e) =>
                      setForm({ ...form, breed: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.age}
                    onChange={(e) =>
                      setForm({ ...form, age: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.files[0] })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {showImageModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pet Image</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowImageModal(false)}
                />
              </div>

              <div className="modal-body text-center">
                <img
                  src={previewImage}
                  alt="Pet"
                  className="img-fluid rounded"
                  style={{ maxHeight: "70vh" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagePets;
