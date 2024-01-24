import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";
import {
  createBrand,
  deleteABrand,
  getABrand,
  getAllBBrands,
  updateBrand,
} from "../../services/brandServices";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.get("/:id", getABrand);
router.get("/", getAllBBrands);
router.delete("/:id", authMiddleware, isAdmin, deleteABrand);

export default router;
