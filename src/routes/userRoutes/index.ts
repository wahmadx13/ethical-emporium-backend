import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { addToUserCart } from "../../services/userServices";

const router = express.Router();

router.post("/", authMiddleware, addToUserCart);

export default router;
