import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed]
  );

  res.status(201).json({ message: "User registered" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const [users] = await db.query(
    "SELECT * FROM users WHERE email=?",
    [email]
  );

  if (!users.length) return res.status(401).json({ message: "Invalid credentials" });

  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};
