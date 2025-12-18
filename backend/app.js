import express from "express";
import authRoutes from "./routes/auth.routes.js";
import petRoutes from "./routes/pet.routes.js";
import adoptionRoutes from "./routes/adoption.routes.js";
import cors from 'cors';

const app = express();
app.use(cors())
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoptions", adoptionRoutes);

export default app;
