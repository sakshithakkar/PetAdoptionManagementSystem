import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";
import * as ctrl from "../controllers/adoption.controller.js";

const router = express.Router();

// User
router.post("/:petId", auth, ctrl.applyAdoption);
router.get("/me", auth, ctrl.myApplications);

// Admin
router.get("/", auth, adminOnly, ctrl.allApplications);
router.put("/:id", auth, adminOnly, ctrl.updateStatus);

export default router;
