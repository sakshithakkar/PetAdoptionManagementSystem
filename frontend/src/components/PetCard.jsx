import { Link } from "react-router-dom";

const PetCard = ({ pet }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{pet.name}</h5>

        <p className="card-text mb-1">
          <strong>Species:</strong> {pet.species}
        </p>

        <p className="card-text mb-1">
          <strong>Breed:</strong> {pet.breed}
        </p>

        <p className="card-text">
          <strong>Age:</strong> {pet.age} year
        </p>

        <div className="mt-auto">
          <Link
            to={`/pets/${pet.id}`}
            className="btn btn-primary w-100"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
