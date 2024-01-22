import express from "express";
import {
  createProduct,
  deleteAProduct,
  getAProduct,
  getAllProducts,
  updateAProduct,
} from "../../services/productServices";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/:id", authMiddleware, isAdmin, updateAProduct);
router.get("/", getAllProducts);
router.get("/:id", getAProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteAProduct);

export default router;
