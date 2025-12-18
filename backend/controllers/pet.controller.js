import { db } from "../config/db.js";

// Visitor: list pets with search, filter, pagination
export const getPets = async (req, res) => {
  try {
    const { species, breed, search, page = 1, limit = 10 } = req.query;

    let sql = "SELECT * FROM pets WHERE status='AVAILABLE'";
    const params = [];

    if (species) {
      sql += " AND species = ?";
      params.push(species);
    }

    if (breed) {
      sql += " AND breed = ?";
      params.push(breed);
    }

    if (search) {
      sql += " AND (name LIKE ? OR breed LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(+limit, (+page - 1) * limit);

    const [pets] = await db.query(sql, params);
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pets" });
  }
};

// Visitor: single pet details
export const getPet = async (req, res) => {
  try {
    const [pets] = await db.query(
      "SELECT * FROM pets WHERE id = ?",
      [req.params.id]
    );

    if (!pets.length) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json(pets[0]);
  } catch {
    res.status(500).json({ message: "Error fetching pet" });
  }
};

// Admin: add pet
export const addPet = async (req, res) => {
  try {
    const { name, species, breed, age, description } = req.body;

    await db.query(
      "INSERT INTO pets (name, species, breed, age, description) VALUES (?, ?, ?, ?, ?)",
      [name, species, breed, age, description]
    );

    res.status(201).json({ message: "Pet added" });
  } catch {
    res.status(500).json({ message: "Failed to add pet" });
  }
};

// Admin: update pet
export const updatePet = async (req, res) => {
  try {
    const { name, species, breed, age, description, status } = req.body;

    await db.query(
      `UPDATE pets 
       SET name=?, species=?, breed=?, age=?, description=?
       WHERE id=?`,
      [name, species, breed, age, description, req.params.id]
    );

    res.json({ message: "Pet updated" });
  } catch {
    res.status(500).json({ message: "Failed to update pet" });
  }
};

// Admin: delete pet
export const deletePet = async (req, res) => {
  try {
    await db.query("DELETE FROM pets WHERE id = ?", [req.params.id]);
    res.json({ message: "Pet deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete pet" });
  }
};
