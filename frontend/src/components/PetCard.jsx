import { Link } from "react-router-dom";

const PetCard = ({ pet }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <h6 className="mb-1">{pet.name}</h6>
        <small className="text-muted">
          {pet.species} • {pet.breed} • {pet.age} year
        </small>
      </div>

      <Link
        to={`/pets/${pet.id}`}
        className="btn btn-outline-primary btn-sm"
      >
        View
      </Link>
    </li>
  );
};

export default PetCard;
