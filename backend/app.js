import express from "express";
import authRoutes from "./routes/auth.routes.js";
import petRoutes from "./routes/pet.routes.js";
import adoptionRoutes from "./routes/adoption.routes.js";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
app.use(cors())
app.use(express.json());
app.use("/api/uploads", express.static(uploadsDir));


app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoptions", adoptionRoutes);

export default app;
