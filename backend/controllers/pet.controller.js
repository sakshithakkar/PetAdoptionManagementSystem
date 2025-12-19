import { db } from "../config/db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "..", "uploads");

// Set storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // folder to store images
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  }
});

export const upload = multer({ storage });


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
    const image = req.file ? req.file.filename : null; // filename from multer

    await db.query(
      "INSERT INTO pets (name, species, breed, age, description, image) VALUES (?, ?, ?, ?, ?, ?)",
      [name, species, breed, age, description, image]
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
    const image = req.file ? req.file.filename : null;
    const params = [name, species, breed, age, description];
    let query = `UPDATE pets SET name=?, species=?, breed=?, age=?, description=?`;

    if (image) {
      query += `, image=?`;
      params.push(image);
    }

    query += ` WHERE id=?`;
    params.push(req.params.id);

    await db.query(
      query,
      params
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
