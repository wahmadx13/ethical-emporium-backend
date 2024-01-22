import express from "express";
import {
  addToWishlist,
  createProduct,
  deleteAProduct,
  getAProduct,
  getAllProducts,
  rating,
  updateAProduct,
} from "../../services/productServices";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put("/:id", authMiddleware, isAdmin, updateAProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.get("/", getAllProducts);
router.get("/:id", getAProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteAProduct);

export default router;
