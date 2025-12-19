import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";

const PetList = () => {
  // Full dataset fetched from API (used as source of truth)
  const [allPets, setAllPets] = useState([]);

  // Pets after applying search & filters
  const [pets, setPets] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);

  // Search input state
  const [search, setSearch] = useState("");

  // Filter values
  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    age: ""
  });

  // Dropdown options
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [breedOptions, setBreedOptions] = useState([]);

  // Fetch all pets once on mount
  const fetchPets = async () => {
    try {
      const res = await api.get("/pets");

      // Store full dataset
      setAllPets(res.data);
      setPets(res.data);

      // Create unique dropdown values from dataset
      const speciesSet = new Set(res.data.map(p => p.species));
      const breedSet = new Set(res.data.map(p => p.breed));

      setSpeciesOptions([...speciesSet]);
      setBreedOptions([...breedSet]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Apply search and filters whenever inputs change
  useEffect(() => {
    let filtered = [...allPets];

    // Search by pet name or breed
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.breed.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filters
    if (filters.species) {
      filtered = filtered.filter(p => p.species === filters.species);
    }

    if (filters.breed) {
      filtered = filtered.filter(p => p.breed === filters.breed);
    }

    if (filters.age) {
      filtered = filtered.filter(
        p => Number(p.age) === Number(filters.age)
      );
    }

    // Update filtered list and reset to first page
    setPets(filtered);
    setPage(1);
  }, [search, filters, allPets]);

  // Clear search input
  const clearSearch = () => setSearch("");

  // Reset all filters
  const clearFilters = () =>
    setFilters({ species: "", breed: "", age: "" });

  // Pagination logic
  const pageSize = 10;
  const paginatedPets = pets.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const hasMore = page * pageSize < pets.length;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Pets</h2>

      {/* SEARCH & FILTERS */}
      <div className="row mb-3 g-2">
        {/* Search input */}
        <div className="col-md-4 position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or breed"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Clear search button */}
          {search && (
            <button
              className="btn btn-sm btn-outline-secondary position-absolute end-0 top-0 mt-1 me-1"
              style={{ height: "30px", width: "30px", padding: 0 }}
              onClick={clearSearch}
            >
              &times;
            </button>
          )}
        </div>

        {/* Species filter */}
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.species}
            onChange={(e) =>
              setFilters({ ...filters, species: e.target.value })
            }
          >
            <option value="">All Species</option>
            {speciesOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Breed filter */}
        <div className="col-md-2">
          <select
            className="form-select"
            value={filters.breed}
            onChange={(e) =>
              setFilters({ ...filters, breed: e.target.value })
            }
          >
            <option value="">All Breeds</option>
            {breedOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Age filter */}
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Age"
            value={filters.age}
            onChange={(e) =>
              setFilters({ ...filters, age: e.target.value })
            }
          />
        </div>

        {/* Clear filters button */}
        <div className="col-md-2 d-flex gap-2">
          <button
            className="btn btn-outline-primary w-100"
            disabled={!filters.species && !filters.breed && !filters.age}
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* PET LIST */}
      <div className="list-group">
        {paginatedPets.length === 0 ? (
          <p className="text-center text-muted">No pets found.</p>
        ) : (
          paginatedPets.map((pet) => (
            <div
              key={pet.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{pet.name}</strong> ({pet.species} - {pet.breed}) <br />
                Age: {pet.age}
              </div>

              {/* Navigate to pet details page */}
              <Link
                to={`/pets/${pet.id}`}
                className="btn btn-primary btn-sm"
              >
                View Details
              </Link>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          page={page}
          setPage={setPage}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
};

export default PetList;
