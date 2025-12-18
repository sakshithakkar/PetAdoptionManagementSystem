import { useEffect, useState } from "react";
import api from "../../api/axios";
import PetCard from "../../components/PetCard";
import Pagination from "../../components/Pagination";

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .get("/pets", { params: { page, limit: 6 } })
      .then(res => setPets(res.data));
  }, [page]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Available Pets for Adoption</h2>

      <div className="row g-4">
        {pets.length === 0 ? (
          <p className="text-center">No pets available at the moment.</p>
        ) : (
          pets.map(pet => (
            <div className="col-sm-6 col-md-4" key={pet.id}>
              <PetCard pet={pet} />
            </div>
          ))
        )}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Pagination
          page={page}
          setPage={setPage}
          hasMore={pets.length === 6}
        />
      </div>
    </div>
  );
};

export default PetList;
