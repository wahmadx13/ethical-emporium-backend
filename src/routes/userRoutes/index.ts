import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
  addToUserCart,
  emptyUserCart,
  removeAnItemFromCart,
} from "../../services/userServices";

const router = express.Router();

router.post("/", authMiddleware, addToUserCart);
router.put("/remove-item", authMiddleware, removeAnItemFromCart);
router.put("/empty-cart", authMiddleware, emptyUserCart);

export default router;
