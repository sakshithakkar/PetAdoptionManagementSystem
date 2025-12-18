import { db } from "../config/db.js";

// User: apply for adoption
export const applyAdoption = async (req, res) => {
  try {
    const { petId } = req.params;

    // Check pet availability
    const [pets] = await db.query(
      "SELECT status FROM pets WHERE id=?",
      [petId]
    );

    if (!pets.length) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pets[0].status !== "AVAILABLE") {
      return res.status(400).json({ message: "Pet not available" });
    }

    // Apply
    await db.query(
      "INSERT INTO adoptions (user_id, pet_id) VALUES (?, ?)",
      [req.user.id, petId]
    );

    // Update pet status
    await db.query(
      "UPDATE pets SET status='PENDING' WHERE id=?",
      [petId]
    );

    res.json({ message: "Adoption application submitted" });
  } catch (err) {
    // Duplicate apply safeguard
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Already applied" });
    }
    res.status(500).json({ message: "Failed to apply" });
  }
};

// User: view own applications
export const myApplications = async (req, res) => {
  try {
    const [apps] = await db.query(
      `SELECT a.id, p.name, p.species, p.breed, a.status, a.applied_at
       FROM adoptions a
       JOIN pets p ON a.pet_id = p.id
       WHERE a.user_id = ?`,
      [req.user.id]
    );

    res.json(apps);
  } catch {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Admin: view all applications
export const allApplications = async (req, res) => {
  try {
    const [apps] = await db.query(
      `SELECT a.id, u.name AS user, p.name AS pet, a.status
       FROM adoptions a
       JOIN users u ON a.user_id = u.id
       JOIN pets p ON a.pet_id = p.id`
    );

    res.json(apps);
  } catch {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Admin: approve / reject application
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // APPROVED / REJECTED

    const [rows] = await db.query(
      "SELECT pet_id FROM adoptions WHERE id=?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Application not found" });
    }

    await db.query(
      "UPDATE adoptions SET status=? WHERE id=?",
      [status, req.params.id]
    );

    // Update pet status
    const petStatus = status === "APPROVED" ? "ADOPTED" : "AVAILABLE";
    await db.query(
      "UPDATE pets SET status=? WHERE id=?",
      [petStatus, rows[0].pet_id]
    );

    res.json({ message: "Application updated" });
  } catch {
    res.status(500).json({ message: "Failed to update status" });
  }
};
