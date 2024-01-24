import express from "express";
import {
  addToWishlist,
  createProduct,
  deleteAProduct,
  deleteProductImages,
  getAProduct,
  getAllProducts,
  rating,
  updateAProduct,
  uploadProductImages,
} from "../../services/productServices";
import { authMiddleware } from "../../middleware/authMiddleware";
import { isAdmin } from "../../middleware/isAdmin";
import {
  resizeProductImage,
  uploadPhoto,
} from "../../middleware/imageMiddleware";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put(
  "/upload-product-images/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  resizeProductImage,
  uploadProductImages
);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.get("/", getAllProducts);
router.put("/:id", authMiddleware, isAdmin, updateAProduct);
router.get("/:id", getAProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteAProduct);
router.delete(
  "/delete-product-images/:id",
  authMiddleware,
  isAdmin,
  deleteProductImages
);

export default router;
