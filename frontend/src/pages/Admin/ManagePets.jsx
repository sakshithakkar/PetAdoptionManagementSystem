import { useEffect, useState } from "react";
import api from "../../api/axios";

const initialForm = {
  name: "",
  species: "",
  breed: "",
  age: "",
  description: "",
};

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    const res = await api.get("/pets");
    setPets(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/pets/${editingId}`, form);
    } else {
      await api.post("/pets", form);
    }

    setForm(initialForm);
    setEditingId(null);
    fetchPets();
  };

  const remove = async (id) => {
    await api.delete(`/pets/${id}`);
    setPets(pets.filter(p => p.id !== id));
  };

  const edit = (pet) => {
    setEditingId(pet.id);
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      description: pet.description,
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Pets</h2>

      {/* FORM CARD */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>{editingId ? "Edit Pet" : "Add New Pet"}</strong>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Pet Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Species"
                  value={form.species}
                  onChange={e => setForm({ ...form, species: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Breed"
                  value={form.breed}
                  onChange={e => setForm({ ...form, breed: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Age"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  required
                />
              </div>

              <div className="col-12">
                <textarea
                  className="form-control"
                  placeholder="Description"
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-3">
              <button className="btn btn-primary me-2" type="submit">
                {editingId ? "Update Pet" : "Add Pet"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* PET LIST */}
      <div className="card">
        <div className="card-header">
          <strong>Pet List</strong>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pets.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No pets found
                  </td>
                </tr>
              )}

              {pets.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.species}</td>
                  <td>{p.breed}</td>
                  <td>{p.age}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => edit(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagePets;
