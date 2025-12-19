import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";
import * as petCtrl from "../controllers/pet.controller.js";

const router = express.Router();

// Visitor
router.get("/", petCtrl.getPets);
router.get("/:id", petCtrl.getPet);

// Admin
router.post("/", auth, adminOnly, petCtrl.upload.single("image"), petCtrl.addPet);
router.put("/:id", auth, adminOnly,petCtrl.upload.single("image"), petCtrl.updatePet);
router.delete("/:id", auth, adminOnly, petCtrl.deletePet);

export default router;
